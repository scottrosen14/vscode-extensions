"use strict";

var showFileFinder = (function () {

    var filesCache=[];
    var vs,watcher;

    function showFileFinder(vscode) {
        vs=vscode;
        if(filesCache.length){
            showFiles(filesCache);
        }
        else{
            vs.workspace.findFiles('**/**', '',5120)
            .then(uries=>{
                for(var i=0;i<uries.length;i++){
                    filesCache[i]=getQuickPickItem(uries[i]);
                }
                initlizeFileWatcher();
                showFiles(filesCache);
            });
        }
    }
    
    //show files
    function showFiles(files){
        vs.window.showQuickPick(files,{
            matchOnDetail:true
        })
        .then(file=>{
            if(file&&file.path) 
                openFile(file.path)
        });
    }

    //open file
    function openFile(path){
        vs.workspace.openTextDocument(path)
        .then(txtDocument=>vs.window.showTextDocument(txtDocument));
    }

    //filename
    function getFileName(path) {
        return path.substring(path.lastIndexOf('/')+1);
    }

    //relative
    function getRelativeFileName(fsPath){
        return fsPath.substring(vs.workspace.rootPath.length);
    }

    //get file list item for show
    function getQuickPickItem(uri){
        return {
              detail:getRelativeFileName(uri.fsPath),
              label:getFileName(uri.path),
              path:uri.path
        };
    }

    function initlizeFileWatcher(){
        watcher=vs.workspace.createFileSystemWatcher('**/**');
        watcher.onDidCreate(onFileSystemCreateEvent);
        watcher.onDidDelete(onFileSystemDeleteEvent);
    }

    function onFileSystemCreateEvent(uri){
        if(filesCache.length>6144)
            return;
        filesCache.push(getQuickPickItem(uri));
    }

    function onFileSystemDeleteEvent(uri){
        for(var i=0;i<filesCache.length;i++){
            if(filesCache[i].path==uri.path){
                filesCache.splice(i,1);
                break;
            }
        }
    }

    return showFileFinder;
}());

exports.showFileFinder = showFileFinder;