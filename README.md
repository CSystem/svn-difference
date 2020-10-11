
## svndp
 SVN differences packer which will generate versions.json and packer.zip
 
## Installation
 
```
$ npm install svndp -g
```

## Usage

 - Help

 ```
 $ svndp -help
 
 Options:

    -V, --version              output the version number
    -u, --username <string>    svn username (Optional parameters)
    -p, --password <string>    svn password (Optional parameters)
    -o, --output <string>      Output path (Optional parameters)
    -c, --current <n>          Current version
    -l, --last <n>             Last version
    -r, --repository <string>  Repository URL
    -h, --help                 output usage information
```
- Packer
  ```
  svndp -o ${output} -c ${current} -l ${last} -r ${repository}
  
  or
  
  svndp -o ${output} -c ${current} -l ${last} -r ${repository} -u ${username} -p ${password}
  
  ```
  
- Versions JSON
  
```
versions.json

{
    "packages": {
        "88358": {
            "size": 425,
            "md5": "402f29af62ed3bd6f36c55f76701992f",
            "date": "20180830152514",
            "version": 88359,
            "filename": "game_c88359_l88358_d20180830152514.zip"
        },
        "88359": {
            "size": 22,
            "md5": "ade4f0309f72fa28771bf5fef059dcae",
            "date": "20180830152750",
            "version": 88364,
            "filename": "game_c88364_l88359_d20180830152750.zip"
        }
    },
    "latestVersion": 88364
}
```

 




