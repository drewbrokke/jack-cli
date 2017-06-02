"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_elements_1 = require("./interface-elements");
let notificationContainer;
const COLOR_ERROR = 'red';
const COLOR_SUCCESS = '#294';
function getNotificationContainer() {
    if (!notificationContainer) {
        notificationContainer = interface_elements_1.getBoxElement({
            bottom: 0,
            right: 0,
            shrink: true,
        });
    }
    return notificationContainer;
}
exports.getNotificationContainer = getNotificationContainer;
function notifyError(content) {
    notificationContainer.append(getNotification(content, COLOR_ERROR));
}
exports.notifyError = notifyError;
function notifySuccess(content) {
    notificationContainer.append(getNotification(content, COLOR_SUCCESS));
}
exports.notifySuccess = notifySuccess;
// Helper functions
function getNotification(content, bg) {
    const options = {
        align: 'center',
        bg,
        clickable: true,
        content,
        padding: {
            bottom: 1,
            left: 2,
            right: 2,
            top: 1,
        },
        shrink: true,
        valign: 'middle',
    };
    const notification = interface_elements_1.getTextElement(options);
    const screen = notification.screen;
    const notificationDestroyTimer = setTimeout(() => {
        notification.destroy();
        screen.render();
    }, 3000);
    notification.on('mouseup', () => {
        clearTimeout(notificationDestroyTimer);
        notification.destroy();
        screen.render();
    });
    return notification;
}
