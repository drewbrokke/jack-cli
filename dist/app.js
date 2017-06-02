"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commit_view_1 = require("./interface/commit-view");
const interface_elements_1 = require("./interface/interface-elements");
const list_view_1 = require("./interface/list-view");
const screen_1 = require("./interface/screen");
const action_creators_1 = require("./redux/action-creators");
const store_1 = require("./redux/store");
const git_util_1 = require("./util/git-util");
function run(args) {
    store_1.store.subscribe(renderScreen(screen_1.getScreen()));
    let dataString = '';
    const gitLogProcess = git_util_1.getGitLogProcess(args);
    gitLogProcess.stdout.setEncoding('utf8');
    gitLogProcess.stdout.on('data', (data) => dataString += data);
    gitLogProcess.on('close', () => store_1.store.dispatch(action_creators_1.addCommits(dataString.split('\n'))));
}
exports.run = run;
function renderScreen(screen) {
    let lastState = store_1.store.getState();
    const commitContentMap = new Map();
    let commit;
    let list;
    let progressBar;
    return () => {
        const state = store_1.store.getState();
        const { commits, index, SHA, view } = state;
        const lastView = lastState.view;
        const isNewView = view !== lastView;
        const isNewIndex = index !== lastState.index;
        const isNewCommits = commits !== lastState.commits;
        /*

        Create elements if they don't exist

        */
        if (!commit) {
            commit = commit_view_1.getCommitElement();
            screen.append(commit);
        }
        if (!list) {
            list = list_view_1.getListElement();
            screen.append(list);
        }
        if (!progressBar) {
            progressBar = interface_elements_1.getTextElement(interface_elements_1.constructProgressText(index, commits.length));
            screen.append(progressBar);
        }
        /*

        UI update conditions

        */
        if (isNewCommits) {
            list.setItems(commits);
        }
        if (isNewCommits || isNewIndex) {
            progressBar.setText(interface_elements_1.constructProgressText(index, commits.length));
            list.select(index);
        }
        if (view === 'LIST' && isNewView) {
            swapViews(commit, list);
            list.select(index);
        }
        if (view === 'COMMIT') {
            if (isNewView) {
                swapViews(list, commit);
            }
            if (isNewView || isNewIndex) {
                let content = commitContentMap.get(SHA);
                if (!content) {
                    content = git_util_1.getCommitContentSync(SHA);
                    commitContentMap.set(SHA, content);
                }
                commit.setContent(content);
            }
        }
        screen.render();
        lastState = state;
        return screen;
    };
}
function swapViews(oldViewElement, newViewElement) {
    oldViewElement.hide();
    newViewElement.show();
    newViewElement.focus();
}
