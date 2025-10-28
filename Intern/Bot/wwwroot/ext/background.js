var ruleCounter = 1000;


function printRules(rules) {
    rules.forEach(element => {
        console.log(element);
    });
}

async function getCurrentTab() {
    var queryOptions = { active: true, lastFocusedWindow: true };

    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);

    return tab;
}

async function updateUI() {
    try {
        var tab = await getCurrentTab();
        if (!tab) return;

        var isDisabled = await isRuleApplied(tab.url);
        var iconColor = isDisabled ? '' : '-gray';
        chrome.action.setIcon({ path: `images/autobotps-60${iconColor}.png` });
    } catch (e) {
        console.error(e);
    }
}

async function isRuleApplied(url) {
    var rules = await chrome.declarativeNetRequest.getSessionRules();
    rules && printRules(rules);

    var index = rules.findIndex(rule => rule.condition.urlFilter == url);
    return index >= 0;
}

async function resetRules() {
    try {
        var addRules = [];
        var removeRuleIds = [];

        // remove old rules
        var rules = await chrome.declarativeNetRequest.getSessionRules();
        removeRuleIds = rules.map(r => r.id);
        await chrome.declarativeNetRequest.updateSessionRules({ addRules, removeRuleIds });

        removeRuleIds = [];

        // create rule
        addRules.push({
            id: ruleCounter++,
            action: {
                type: 'modifyHeaders',
                responseHeaders: [{
                    header: 'content-security-policy',
                    operation: 'set',
                    value: ''
                }]
            },
            condition: {
                urlFilter: "*vps*",
                resourceTypes: ['main_frame', 'sub_frame']
            }
        })

        addRules.push({
            id: ruleCounter++,
            action: {
                type: 'modifyHeaders',
                responseHeaders: [{
                    header: 'content-security-policy',
                    operation: 'set',
                    value: ''
                }]
            },
            condition: {
                urlFilter: "*autobotps*",
                resourceTypes: ['main_frame', 'sub_frame']
            }
        })

        // apply rules
        await chrome.declarativeNetRequest.updateSessionRules({ addRules, removeRuleIds });
    } catch (e) {
        console.error(e);
    }
}

function init() {
    try {
        // reset all rules
        resetRules();

        // When the user clicks the plugin icon
        chrome.action.onClicked.addListener((tab) => {
            updateUI();
        })

        // When the user changes tab
        chrome.tabs.onActivated.addListener((activeInfo) => {
        })

        // When the tab changed
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        });
    } catch (e) {
        console.error(e);
    }
}

init();