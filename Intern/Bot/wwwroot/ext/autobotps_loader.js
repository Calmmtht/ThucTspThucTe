const nullthrows = (v) => {
    if (v == null) throw new Error("invalid arguments");
    return v;
}

function loadExtScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = function () {
        console.log("Autobot v1.1");
        this.remove();
    };

    nullthrows(document.head || document.documentElement).appendChild(script);
}

loadExtScript(chrome.runtime.getURL('autobotps_script.js'));
