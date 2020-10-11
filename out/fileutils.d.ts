import { Stats } from "fs";
/**
 * 保存数据到指定文件
 * @param path 文件完整路径名
 * @param data 要保存的数据
 */
export declare function save(path: string, data: any): void;
export declare function writeFileAsync(path: string, content: string, charset: string): Promise<boolean>;
/**
 * 创建文件夹
 */
export declare function createDirectory(path: string, mode?: any): void;
/**
 * 读取文本文件,返回打开文本的字符串内容，若失败，返回"".
 * @param path 要打开的文件路径
 */
export declare function read(path: string, ignoreCache?: boolean): string;
export declare function readFileAsync(path: string, charset: string): Promise<string>;
/**
 * 读取字节流文件,返回字节流，若失败，返回null.
 * @param path 要打开的文件路径
 */
export declare function readBinary(path: string): any;
/**
 * 复制文件或目录
 * @param source 文件源路径
 * @param dest 文件要复制到的目标路径
 */
export declare function copy(source: string, dest: string): void;
export declare function isDirectory(path: string): boolean;
export declare function isSymbolicLink(path: string): boolean;
export declare function isFile(path: string): boolean;
/**
 * 删除文件或目录
 * @param path 要删除的文件源路径
 */
export declare function remove(path: string): void;
export declare function rename(oldPath: any, newPath: any): void;
/**
 * 返回指定文件的父级文件夹路径,返回字符串的结尾已包含分隔符。
 */
export declare function getDirectory(path: string): string;
/**
 * 获得路径的扩展名,不包含点字符。
 */
export declare function getExtension(path: string): string;
/**
 * 获取路径的文件名(不含扩展名)或文件夹名
 */
export declare function getFileName(path: string): string;
/**
 * 获取指定文件夹下的文件或文件夹列表，不包含子文件夹内的文件。
 * @param path 要搜索的文件夹
 * @param relative 是否返回相对路径，若不传入或传入false，都返回绝对路径。
 */
export declare function getDirectoryListing(path: string, relative?: boolean): string[];
/**
 * 获取指定文件夹下全部的文件列表，包括子文件夹
 * @param path
 * @returns {any}
 */
export declare function getDirectoryAllListing(path: string): string[];
/**
 * 使用指定扩展名搜索文件夹及其子文件夹下所有的文件
 * @param dir 要搜索的文件夹
 * @param extension 要搜索的文件扩展名,不包含点字符，例如："png"。不设置表示获取所有类型文件。
 */
export declare function search(dir: string, extension?: string): string[];
/**
 * 使用过滤函数搜索文件夹及其子文件夹下所有的文件
 * @param dir 要搜索的文件夹
 * @param filterFunc 过滤函数：filterFunc(file:File):Boolean,参数为遍历过程中的每一个文件，返回true则加入结果列表
 */
export declare function searchByFunction(dir: string, filterFunc: Function, checkDir?: boolean): string[];
/**
 * 指定路径的文件或文件夹是否存在
 */
export declare function exists(path: string): boolean;
/**
 * 转换本机路径为Unix风格路径。
 */
export declare function escapePath(path: string): string;
/**
 * 连接路径,支持传入多于两个的参数。也支持"../"相对路径解析。返回的分隔符为Unix风格。
 */
export declare function joinPath(dir: string, ...filename: string[]): string;
export declare function getRelativePath(dir: string, filename: string): string;
export declare function basename(p: string, ext?: string): string;
export declare function relative(from: string, to: string): any;
export declare function searchPath(searchPaths: string[]): string | null;
export declare function moveAsync(oldPath: string, newPath: string): Promise<void>;
export declare function existsSync(path: string): boolean;
export declare function existsAsync(path: string): Promise<boolean>;
export declare function copyAsync(src: string, dest: string): Promise<void>;
export declare function removeAsync(dir: string): Promise<void>;
export declare function readFileSync(filename: string, encoding: string): string;
export declare function readJSONAsync(file: string, options?: {
    encoding: string;
    flag?: string;
}): Promise<any>;
export declare function readJSONSync(file: string): any;
export declare function statSync(path: string): Stats;
export declare function writeJSONAsync(file: string, object: any): Promise<void>;
