#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * file : main.ts
 * author : wangpengfei
 * date : 2018/08/29
 * description : check svn and export diff files to zip
 */
var SVN = require("nodejs-svn");
var path = require("path");
var command = require("commander");
var fileutils = require("./fileutils");
var zip = require("jszip");
var md5 = require("md5");
var VersionData = (function () {
    function VersionData() {
        this.packages = {};
    }
    return VersionData;
}());
var VPackage = (function () {
    function VPackage() {
    }
    return VPackage;
}());
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
function filterDifference(text) {
    var arr = text.split("\n");
    var pathArr = [];
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var s = arr_1[_i];
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
function copyAndPack(output, repo, files) {
    return __awaiter(this, void 0, void 0, function () {
        var z, _i, files_1, f, src, bf, content, versionBundle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    z = new zip();
                    for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                        f = files_1[_i];
                        src = path.join(repo, f);
                        if (!src) {
                            console.error("can't read buffer from " + src);
                            break;
                        }
                        bf = fileutils.readBinary(src);
                        z.file(f, bf);
                    }
                    return [4 /*yield*/, z.generateAsync({ type: "uint8array", compression: "DEFLATE", })];
                case 1:
                    content = _a.sent();
                    fileutils.save(output, content);
                    versionBundle = new VPackage();
                    versionBundle.size = content.byteLength;
                    versionBundle.md5 = md5(content);
                    versionBundle.date = formatDateTime(new Date());
                    return [2 /*return*/, versionBundle];
            }
        });
    });
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
    var username = command["username"];
    var password = command["password"];
    var currentVersion = command["current"];
    var lastVersion = command["last"];
    var repo = command["repository"];
    var output = command["output"];
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
        debug: false,
        cwd: repo,
    });
    svn.command({
        command: 'diff',
        args: ["-r" + currentVersion + ":" + lastVersion, "--summarize"],
        options: {},
        callback: function (err, text, params) {
            if (err) {
                console.log(err);
            }
            var diffArray = filterDifference(text);
            console.log(packageOutput);
            copyAndPack(packageOutput, repo, diffArray).then(function (vData) {
                if (!vData) {
                    throw "copyAndPack error";
                }
                //生成版本控制文件
                vData.version = currentVersion;
                vData.filename = packageFilename;
                versionsData.latestVersion = currentVersion;
                versionsData.packages[lastVersion] = vData;
                fileutils.save(versionsPath, JSON.stringify(versionsData));
                var d = JSON.stringify(vData);
                console.log("diff complete : " + d);
            });
        }
    });
}
main();
//# sourceMappingURL=main.js.map