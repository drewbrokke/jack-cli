"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commit_view_1 = require("./interface/commit-view");
const list_view_1 = require("./interface/list-view");
const notification_1 = require("./interface/notification");
const progress_indicator_1 = require("./interface/progress-indicator");
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
    let commitList;
    let notificationContainer;
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
        if (!commitList) {
            commitList = list_view_1.getCommitListElement();
            screen.append(commitList);
        }
        if (!progressBar) {
            progressBar = progress_indicator_1.getProgressIndicator(progress_indicator_1.constructProgressText(index, commits.length));
            screen.append(progressBar);
        }
        if (!notificationContainer) {
            notificationContainer = notification_1.getNotificationContainer();
            screen.append(notificationContainer);
        }
        /*

        UI update conditions

        */
        if (state.notificationRequested) {
            notification_1.notifySuccess(state.notificationText);
            store_1.store.dispatch(action_creators_1.notificationSent());
        }
        if (isNewCommits) {
            commitList.setItems(commits);
        }
        if (isNewCommits || isNewIndex) {
            progressBar.setText(progress_indicator_1.constructProgressText(index, commits.length));
            commitList.select(index);
        }
        if (view === 'LIST' && isNewView) {
            swapViews(commit, commitList);
            commitList.select(index);
        }
        if (view === 'COMMIT') {
            if (isNewView) {
                swapViews(commitList, commit);
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
