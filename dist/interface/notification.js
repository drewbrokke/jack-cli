"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var help_text_1 = require("../util/help-text");
var interface_elements_1 = require("./interface-elements");
var notificationContainer;
var helpBox;
var COLOR_ERROR = 'red';
var COLOR_INFO = 'blue';
var COLOR_SUCCESS = 'green';
var COLOR_WARNING = 'yellow';
function getNotificationContainer() {
    if (notificationContainer) {
        return notificationContainer;
    }
    notificationContainer = interface_elements_1.getBoxElement({
        bottom: 0,
        right: 0,
        shrink: true,
    });
    return notificationContainer;
}
exports.getNotificationContainer = getNotificationContainer;
function notifyError(content) {
    appendNotification(getNotification(content, COLOR_ERROR));
}
exports.notifyError = notifyError;
function notifyInfo(content) {
    appendNotification(getNotification(content, COLOR_INFO));
}
exports.notifyInfo = notifyInfo;
function notifySuccess(content) {
    appendNotification(getNotification(content, COLOR_SUCCESS));
}
exports.notifySuccess = notifySuccess;
function notifyWarning(content) {
    appendNotification(getNotification(content, COLOR_WARNING));
}
exports.notifyWarning = notifyWarning;
function appendNotification(notification) {
    notificationContainer.append(notification);
    notificationContainer.screen.render();
}
function toggleHelp() {
    if (!helpBox) {
        helpBox = getPersistentNotification(help_text_1.helpText, 'none');
        notificationContainer.append(helpBox);
    }
    else {
        helpBox.toggle();
    }
    notificationContainer.screen.render();
}
exports.toggleHelp = toggleHelp;
// Helper functions
function getNotification(content, bg) {
    var options = {
        align: 'center',
        bg: bg,
        clickable: true,
        content: content,
        padding: {
            bottom: 1,
            left: 2,
            right: 2,
            top: 1,
        },
        shrink: true,
        valign: 'middle',
    };
    var notification = interface_elements_1.getTextElement(options);
    var screen = notification.screen;
    var notificationDestroyTimer = setTimeout(function () {
        notification.destroy();
        screen.render();
    }, 5000);
    notification.on('mouseup', function () {
        clearTimeout(notificationDestroyTimer);
        notification.destroy();
        screen.render();
    });
    return notification;
}
function getPersistentNotification(content, bg) {
    var options = {
        align: 'center',
        bg: bg,
        border: 'line',
        clickable: true,
        content: content,
        padding: {
            bottom: 1,
            left: 2,
            right: 2,
            top: 1,
        },
        shrink: true,
        valign: 'middle',
    };
    var notification = interface_elements_1.getTextElement(options);
    var screen = notification.screen;
    notification.on('mouseup', function () {
        notification.destroy();
        screen.render();
    });
    notification.focus();
    return notification;
}
