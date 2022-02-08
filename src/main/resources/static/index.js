/*
 * Copyright (c) 2022 by MILOSZ GILGA <https://miloszgilga.pl>
 *
 * File name: index.js
 * Last modified: 08/02/2022, 16:14
 * Project name: websockets
 *
 * Licensed under the MIT license; you may not use this file except in compliance with the License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * THE ABOVE COPYRIGHT NOTICE AND THIS PERMISSION NOTICE SHALL BE INCLUDED IN ALL
 * COPIES OR SUBSTANTIAL PORTIONS OF THE SOFTWARE.
 */

const selectors = {
    form: document.querySelector('form'),
    connect: document.getElementById('connect'),
    disconnect: document.getElementById('disconnect'),
    send: document.getElementById('send'),
    name: document.getElementById('name'),
    greetings: document.getElementById('greetings'),
    conversation: document.getElementById('conversation'),
};

class WebSockets {
    _stompClient = null;

    connect() {
        const socket = new SockJS('/stomp-endpoint');
        this._stompClient = Stomp.over(socket);
        this._stompClient.connect({}, frame => {
            this.setConnected(true);
            console.log('Connected: ' + frame);
            this._stompClient.subscribe('/topic/greetings', function (greeting) {
                WebSockets.showGreeting(JSON.parse(greeting.body));
            });
        });
    };

    showGreeting(message) {
        selectors.greetings.append("<tr><td>" + message.message + "</td></tr>");
    }

    disconnect() {
        if (this._stompClient !== null) {
            this._stompClient.disconnect();
        }
        this.setConnected(false);
        console.log("Disconnected");
    };

    sendName() {
        this._stompClient.send("/app/hello", {}, JSON.stringify({'name': selectors.name.val()}));
    };

    setConnected(connected) {
        const { connect, disconnect, conversation, greetings } = selectors;
        connect.prop("disabled", connected);
        disconnect.prop("disabled", !connected);
        if (connected) {
            conversation.show();
        }
        else {
            conversation.hide();
        }
        greetings.html("");
    };

}

$(function () {
    const { form, connect, disconnect, send } = selectors;
    const webSockets = new WebSockets();
    form.addEventListener('click', e => e.preventDefault());
    connect.addEventListener('click', () => webSockets.connect());
    disconnect.addEventListener('click', () => webSockets.disconnect());
    send.addEventListener('click', () => webSockets.sendName());
});