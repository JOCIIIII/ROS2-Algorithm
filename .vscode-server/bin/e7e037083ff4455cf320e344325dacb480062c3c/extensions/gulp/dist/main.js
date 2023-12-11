(()=>{"use strict";var t={496:t=>{t.exports=require("vscode")},81:t=>{t.exports=require("child_process")},147:t=>{t.exports=require("fs")},17:t=>{t.exports=require("path")}},e={};function s(i){var o=e[i];if(void 0!==o)return o.exports;var r=e[i]={exports:{}};return t[i](r,r.exports,s),r.exports}var i={};(()=>{var t=i;Object.defineProperty(t,"__esModule",{value:!0}),t.deactivate=t.activate=void 0;const e=s(17),o=s(147),r=s(81),n=s(496);async function a(t){try{if((await o.promises.stat(t)).isFile())return!0}catch(t){return!1}return!1}const c=["build","compile","watch"];function u(t){for(const e of c)if(-1!==t.indexOf(e))return!0;return!1}const d=["test"];function h(t){for(const e of d)if(-1!==t.indexOf(e))return!0;return!1}let l,p;function f(){return l||(l=n.window.createOutputChannel("Gulp Auto Detection")),l}function g(){n.window.showWarningMessage(n.l10n.t("Problem finding gulp tasks. See the output for more information."),n.l10n.t("Go to output")).then((t=>{void 0!==t&&l.show(!0)}))}async function w(t){const s=process.platform;if("win32"===s&&await a(e.join(t,"node_modules",".bin","gulp.cmd"))){const t=e.join(process.env.APPDATA?process.env.APPDATA:"","npm","gulp.cmd");return await a(t)?`"${t}"`:e.join(".","node_modules",".bin","gulp.cmd")}return"linux"!==s&&"darwin"!==s||!await a(e.join(t,"node_modules",".bin","gulp"))?"gulp":e.join(".","node_modules",".bin","gulp")}class b{constructor(t,e){this.c=t,this.d=e}get workspaceFolder(){return this.c}isEnabled(){return"on"===n.workspace.getConfiguration("gulp",this.c.uri).get("autoDetect")}start(){const t=e.join(this.c.uri.fsPath,"{node_modules,gulpfile{.babel.js,.esm.js,.js,.mjs,.cjs,.ts}}");this.a=n.workspace.createFileSystemWatcher(t),this.a.onDidChange((()=>this.b=void 0)),this.a.onDidCreate((()=>this.b=void 0)),this.a.onDidDelete((()=>this.b=void 0))}async getTasks(){return this.isEnabled()?(this.b||(this.b=this.f()),this.b):[]}async getTask(t){const e=t.definition.task;if(e){const s=t.definition,i={cwd:this.workspaceFolder.uri.fsPath};return new n.Task(s,this.workspaceFolder,e,"gulp",new n.ShellExecution(await this.d,[e],i))}}async e(t){for(const s of await o.promises.readdir(t)){const t=e.extname(s);if(".js"!==t&&".mjs"!==t&&".cjs"!==t&&".ts"!==t)continue;if(!a(s))continue;const i=e.basename(s,t).toLowerCase();if("gulpfile"===i)return!0;if("gulpfile.esm"===i)return!0;if("gulpfile.babel"===i)return!0}return!1}async f(){const t="file"===this.c.uri.scheme?this.c.uri.fsPath:void 0,e=[];if(!t)return e;if(!await this.e(t))return e;const s=`${await this.d} --tasks-simple --no-color`;try{const{stdout:e,stderr:a}=await(i=s,o={cwd:t},new Promise(((t,e)=>{r.exec(i,o,((s,i,o)=>{s&&e({error:s,stdout:i,stderr:o}),t({stdout:i,stderr:o})}))})));if(a&&a.length>0){const t=a.split("\n");t.pop(),t.every((t=>t.indexOf("No license field")>=0))||(f().appendLine(a),g())}const c=[];if(e){const t=e.split(/\r{0,1}\n/);for(const e of t){if(0===e.length)continue;const t={type:"gulp",task:e},s={cwd:this.workspaceFolder.uri.fsPath},i=new n.Task(t,this.workspaceFolder,e,"gulp",new n.ShellExecution(await this.d,[e],s));c.push(i);const o=e.toLowerCase();u(o)?i.group=n.TaskGroup.Build:h(o)&&(i.group=n.TaskGroup.Test)}}return c}catch(t){const s=f();return t.stderr&&s.appendLine(t.stderr),t.stdout&&s.appendLine(t.stdout),s.appendLine(n.l10n.t("Auto detecting gulp for folder {0} failed with error: {1}', this.workspaceFolder.name, err.error ? err.error.toString() : 'unknown")),g(),e}var i,o}dispose(){this.b=void 0,this.a&&this.a.dispose()}}class k{constructor(){this.b=new Map}start(){const t=n.workspace.workspaceFolders;t&&this.c(t,[]),n.workspace.onDidChangeWorkspaceFolders((t=>this.c(t.added,t.removed))),n.workspace.onDidChangeConfiguration(this.d,this)}dispose(){this.a&&(this.a.dispose(),this.a=void 0),this.b.clear()}c(t,e){for(const t of e){const e=this.b.get(t.uri.toString());e&&(e.dispose(),this.b.delete(t.uri.toString()))}for(const e of t){const t=new b(e,w(e.uri.fsPath));this.b.set(e.uri.toString(),t),t.isEnabled()&&t.start()}this.e()}d(){for(const t of this.b.values())t.dispose(),this.b.delete(t.workspaceFolder.uri.toString());const t=n.workspace.workspaceFolders;if(t)for(const e of t)if(!this.b.has(e.uri.toString())){const t=new b(e,w(e.uri.fsPath));this.b.set(e.uri.toString(),t),t.isEnabled()&&t.start()}this.e()}e(){if(!this.a&&this.b.size>0){const t=this;this.a=n.tasks.registerTaskProvider("gulp",{provideTasks:()=>t.getTasks(),resolveTask:e=>t.getTask(e)})}else this.a&&0===this.b.size&&(this.a.dispose(),this.a=void 0)}getTasks(){return this.f()}f(){if(0===this.b.size)return Promise.resolve([]);if(1===this.b.size)return this.b.values().next().value.getTasks();{const t=[];for(const e of this.b.values())t.push(e.getTasks().then((t=>t),(()=>[])));return Promise.all(t).then((t=>{const e=[];for(const s of t)s&&s.length>0&&e.push(...s);return e}))}}async getTask(t){if(0!==this.b.size){if(1===this.b.size)return this.b.values().next().value.getTask(t);if(t.scope!==n.TaskScope.Workspace&&t.scope!==n.TaskScope.Global&&t.scope){const e=this.b.get(t.scope.uri.toString());if(e)return e.getTask(t)}}}}t.activate=function(t){p=new k,p.start()},t.deactivate=function(){p.dispose()}})();var o=exports;for(var r in i)o[r]=i[r];i.__esModule&&Object.defineProperty(o,"__esModule",{value:!0})})();
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/e7e037083ff4455cf320e344325dacb480062c3c/extensions/gulp/dist/main.js.map