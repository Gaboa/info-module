import { model } from 'modules/Model/Model';
import { noConnect } from 'modules/Util/NoConnect';

export let request = (() => {
    let serviceUrl;
    let randomId = Math.round(Math.random() * 100000);

    let mode = {};

    function setMode(modes) {
        mode = modes;
    }

    function send(name, options) {
        let url;
        switch (name) {
            case 'Initialise': {
            // Авторизация
                let params = getAllUrlParams();
                let currentMode = params.mode || mode[options];
                let currentService = params.service || 'interslotv2';
                serviceUrl = `https://intergameservice.bossgs.org/${currentService}/SlotService.svc`;
                if (params.demo === 'true') {
                    name = `${name}Demo`;
                }
                if (params.sid) {
                    url = `${serviceUrl}/_${name}/${params.sid}/${currentMode}`; // Вставил SessionID;
                } else {
                    url = `${serviceUrl}/_${name}/dev_${randomId}/${currentMode}`;
                }
            }
                break;
            case 'Roll': {
                console.log('--------------');
                url = `${serviceUrl}/_${name}/${model.data('sessionID')}/${model.balance('betValue')}/${model.balance('coinValue') * 100}`;
            }
                break;
            case 'Ready': {
                url = `${serviceUrl}/_${name}/${model.data('sessionID')}`;
            }
                break;
            case 'Logout': {
                url = `${serviceUrl}/_${name}/${model.data('sessionID')}`;
            }
                break;
            default: {
                console.warn('We have no such request!');
            }
                break;
        }
        return new Promise(function (resolve, reject) {
            if (model.state('isNoConnect')) {
                resolve(noConnect[name]);
            } else {
                let func = function (res) {
                    if (name == 'Roll') {
                        console.log({res, date: new Date()});
                    }
                    console.info(`Request: ${url}`);
                    resolve(res);
                };
                $.ajax({
                    url: url,
                    dataType: 'JSONP',
                    type: 'GET',
                    success: func,
                    error: reject
                });
            }
        });
    }

    function getAllUrlParams(url) {

        // get query string from url (optional) or window
        let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

        // we'll store the parameters here
        let obj = {};

        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            let arr = queryString.split('&');

            for (let i = 0; i < arr.length; i++) {
                // separate the keys and the values
                let a = arr[i].split('=');

                // in case params look like: list[]=thing1&list[]=thing2
                let paramNum = undefined;
                let paramName = a[0].replace(/\[\d*\]/, function (v) {
                    paramNum = v.slice(1, -1);
                    return '';
                });

                // set parameter value (use 'true' if empty)
                let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                paramValue = paramValue.toLowerCase();

                // if parameter name already exists
                if (obj[paramName]) {
                    // convert value to array (if still string)
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }
                    // if no array index number specified...
                    if (typeof paramNum === 'undefined') {
                        // put the value on the end of the array
                        obj[paramName].push(paramValue);
                        // if array index number specified...
                    } else {
                        // put the value at that index number
                        obj[paramName][paramNum] = paramValue;
                    }
                    // if param name doesn't exist yet, set it
                } else {
                    obj[paramName] = paramValue;
                }
            }
        }

        return obj;
    }

    return {
        send,
        getAllUrlParams,
        setMode
    };
})();
