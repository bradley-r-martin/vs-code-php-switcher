
const vscode = require('vscode');
const { spawn } = require('child_process');

class PhpSwitcher{

  constructor(context){
    this.status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    this.status.command = 'extension.phpswitcher';
    context.subscriptions.push(this.status);
    const { status } = this

    this.updateStatus(status,'PHP (...)')
    this.current().then((version)=>{
      this.updateStatus(status,`PHP ${version}`)
    }).catch(()=>{ this.updateStatus(status,`PHP NOT INSTALLED`) })

    let selector = vscode.commands.registerCommand('extension.phpswitcher',()=>{
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Loading available PHP versions."
      },() => {
        const p = new Promise(resolve => {
          this.load().then((versions)=>{
            resolve();
            if(versions.length > 0){
              vscode.window.showQuickPick(versions, {
                placeHolder: 'Select PHP Version to switch to:'
              }).then((version)=>{
                if(version){
                  this.updateStatus(status,'PHP (SWITCHING...)')
                  vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: `Switching to PHP ${version}...`
                  },() => {
                    const q = new Promise(rq => {
                      this.switch(version).then(()=>{
                        this.updateStatus(status,'PHP (...)')
                        this.current().then((version)=>{
                          rq();
                          vscode.window.showInformationMessage(`Successfully switched to: PHP ${version}`)
                          this.updateStatus(status,`PHP ${version}`)
                        })
                      })
                    });
                    return q;
                  });
                }
              });
            }else{
              vscode.window.showErrorMessage('Unable to detect which php versions you have installed.')
            }
          });
        });
        return p;
      });
    });
    context.subscriptions.push(selector);
  }

  /* load
     Return the available php versions install on the host system
  */
  load(){
    return new Promise((resolve)=>{
      const supported = [
        'php@5.5',
        'php@5.6',
        'php@7.0',
        'php@7.1',
        'php@7.2',
        'php@7.3'
      ]
      const terminal = spawn('brew',['ls','--versions'].concat(supported));
      const versions = [];
      terminal.stdout.on('data', (data) => {
        const row = data.toString().split("\n"); 
        row.forEach(version => {
          if(version.includes('php@5.5')){
            versions.push('5.5')
          }else if(version.includes('php@5.6')){
            versions.push('5.6')
          }else if(version.includes('php@7.0')){
            versions.push('7.0')
          }else if(version.includes('php@7.1')){
            versions.push('7.1')
          }else if(version.includes('php@7.2')){
            versions.push('7.2')
          }else if(version.includes('php@7.3')){
            versions.push('7.3')
          }else if(version.includes('php@7.4')){
            versions.push('7.4')
          }else if(version.includes('php@8.0')){
            versions.push('8.0')
          }
        });
      });
      terminal.on('close', () => {
        resolve(versions)
      });
    });
  }
  /* current
     Return the current php version
  */
  current(){
    return new Promise((resolve,reject)=>{
      const terminal = spawn('php',['-r','echo PHP_VERSION;']);
      terminal.stdout.on('data', (data) => {
        resolve(data)
      });
      terminal.stdout.on('error', (err) => {
        reject(err)
      });
    })
  }
  /* switch
     Switch to the specified php version
  */
  switch(version){
    return new Promise((resolve)=>{
      const terminal = spawn('sphp',[version]);
      terminal.stdout.on('data', (data) => {
        console.log(data.toString())
      });
      terminal.on('close', () => {
        resolve()
      });
    })
  }
  /* updateStatus
     Update statusbar text
  */
  updateStatus(item,text){
    item.text = text;
    item.show();
  }

}


function activate(context) {
  new PhpSwitcher(context)
}
function deactivate() {}

exports.activate = activate;

module.exports = {
	activate,
	deactivate
}
