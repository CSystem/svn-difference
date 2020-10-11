/**
 * file : main.ts
 * author : wangpengfei
 * date : 2018/08/29
 * description : check svn and export diff files to zip
 */
import * as SVN from "nodejs-svn";
import * as path from "path";
import * as command from "commander";
import * as fileutils from "./fileutils";
import * as zip from "jszip";
import * as md5 from "md5";

class VersionData {
    latestVersion: string;
    packages: { [v: string]: VPackage } = {};
}

class VPackage {
    md5: string;
    size: number;
    version: number;
    filename: string;
    date: string;
}

function formatDateTime(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var sm = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    var sd = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    var sh = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var sminute = minute < 10 ? ('0' + minute) : minute;
    var ssecond = second < 10 ? ('0' + second) : second;
    return y + '' + sm + sd + sh + sminute + ssecond;
}

function filterDifference(text: string): Array<string> {
    let arr: Array<string> = text.split("\n");
    let pathArr: Array<string> = [];
    for (let s of arr) {
        s = s.trim();
        if (!s || s.charAt(0) == 'D') {
            continue;
        }
        s = s.substr(1);
        s = s.trim();
        pathArr.push(s);
    }
    return pathArr;
}

async function copyAndPack(output, repo, files: string[]) {
    let z = new zip();
    for (let f of files) {
        let src = path.join(repo, f);
        if (!src) {
            console.error(`can't read buffer from ${src}`);
            break;
        }
        let bf = fileutils.readBinary(src);
        z.file(f, bf);
    }
    let content: Buffer = await z.generateAsync({ type: "uint8array", compression: "DEFLATE", });
    fileutils.save(output, content);

    let versionBundle = new VPackage();
    versionBundle.size = content.byteLength;
    versionBundle.md5 = md5(content);
    versionBundle.date = formatDateTime(new Date());
    return versionBundle;
}

function main() {
    command.version('1.0.1')
        .option('-u, --username <string>', 'svn username')
        .option('-p, --password <string>', 'svn password')
        .option('-o, --output <string>', 'Output path')
        .option('-c, --current <n>', 'Current version', parseInt)
        .option('-l, --last <n>', 'Last version', parseInt)
        .option('-r, --repository <string>', 'Repository URL')
        .parse(process.argv);

    let username = command["username"];
    let password = command["password"];
    let currentVersion = command["current"];
    let lastVersion = command["last"];
    let repo = command["repository"];
    let output = command["output"];

    username = username ? '' : username;
    password = password ? '' : password;

    if (!repo || repo === '') {
        console.error('params error');
        return;
    }

    if (typeof lastVersion === 'undefined') {
        lastVersion = 'none';
    }

    if (currentVersion === lastVersion) {
        console.error('current equals to last');
        return;
    }

    if (!fileutils.exists(repo)) {
        console.error('repo not exists');
        return;
    }

    var packageTime = formatDateTime(new Date());
    // 发布目录名
    var packageDir = 'game_c' + currentVersion + '_l' + lastVersion + '_d' + packageTime;
    // 发布文件名
    var packageFilename = packageDir + '.zip';
    //版本控制文件路径
    var versionsPath = "";
    //补丁包输出路径
    var packageOutput = output;
    if (!output || output === '') {
        output = './version_package';
        output = path.join(process.cwd(), output);
    }

    packageOutput = path.join(output, packageFilename);
    versionsPath = path.join(output, "versions.json");
    //版本控制文件
    var versionsData = new VersionData();
    if (fileutils.exists(versionsPath)) {
        versionsData = fileutils.readJSONSync(versionsPath);
    }

    var svn = new SVN({
        username: username,
        passwork: password,
        debug: false, // 是否在控制台打印调试信息
        cwd: repo,
    });

    svn.command(
        {
            command: 'diff',
            args: [`-r${currentVersion}:${lastVersion}`, "--summarize"],
            options: {
            },
            callback: function (err, text, params) {
                if (err) {
                    console.log(err);
                }
                let diffArray = filterDifference(text);
                console.log(packageOutput);
                copyAndPack(packageOutput, repo, diffArray).then((vData: VPackage) => {
                    if (!vData) {
                        throw "copyAndPack error";
                    }
                    //生成版本控制文件
                    vData.version = currentVersion;
                    vData.filename = packageFilename;
                    versionsData.latestVersion = currentVersion;
                    versionsData.packages[lastVersion] = vData;
                    fileutils.save(versionsPath, JSON.stringify(versionsData));
                    let d = JSON.stringify(vData);
                    console.log(`diff complete : ${d}`);
                });
            }
        });
}

main();