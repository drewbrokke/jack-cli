"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_handler_1 = require("./action-handler");
const git_util_1 = require("./git-util");
function run(args) {
    git_util_1.getGitLog(args)
        .then((commits) => {
        if (commits.length) {
            return Promise.resolve(action_handler_1.doAction(1 /* RENDER_LIST */, { commits }));
        }
        else {
            return Promise.reject(new Error('No commits found...'));
        }
    })
        .catch((err) => {
        process.stderr.write(err.message);
        process.exit(1);
    });
}
exports.run = run;
