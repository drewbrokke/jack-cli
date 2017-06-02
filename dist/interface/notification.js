"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_elements_1 = require("./interface-elements");
function getNotification(content) {
    const options = {
        align: 'center',
        bg: '#294',
        bottom: 0,
        clickable: true,
        content,
        padding: {
            bottom: 1,
            left: 2,
            right: 2,
            top: 1,
        },
        right: 0,
        shrink: true,
        valign: 'middle',
    };
    const notification = interface_elements_1.getTextElement(options);
    const notificationDestroyTimer = setTimeout(() => {
        const screen = notification.screen;
        notification.destroy();
        screen.render();
    }, 3000);
    notification.on('mouseup', () => {
        const screen = notification.screen;
        clearTimeout(notificationDestroyTimer);
        notification.destroy();
        screen.render();
    });
    return notification;
}
exports.getNotification = getNotification;
