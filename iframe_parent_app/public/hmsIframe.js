class HMSIframe {
  constructor(urlParams = {}, height=600, width=600, targetDiv='container') {
    var ifrm = document.createElement('iframe');
    var baseUrl = 'http://localhost:8080/?';
    var params = '';
    for(const key in urlParams) {
        params += key;
        params += '=';
        params += urlParams[key];
        params += '&';
    }

    params = params.slice(0, -1);
    const url = baseUrl + params;
    console.log('URL: ', url);
    ifrm.setAttribute('scrolling', 'auto');
    ifrm.setAttribute('src', url);
    ifrm.setAttribute('allow', 'camera;microphone')
    ifrm.setAttribute('height', height);
    ifrm.setAttribute('width', width);
    
    document.getElementById(targetDiv).append(ifrm);
    this.ifrm = ifrm;

    window.addEventListener('message', (event) => {
        console.log('IN PARENT EVENT', event.origin, event.data);
        if (event.origin !== 'http://localhost:8080') return;
        
        var eventType = event.data[0];
        var data = event.data[1];
        console.log('EVENTTTT: ', event)
        if(eventType in this.eventCallbackMappings) {
            console.log('DATAAAAA: ', data)
            this.eventCallbackMappings[eventType](data);
        } 
    });

    this.eventCallbackMappings = {};

  }

  leave() {
    this.ifrm.contentWindow.postMessage(['LEAVE'], "http://localhost:8080");
  }

  on(eventType, eventCallback) {
    this.eventCallbackMappings[eventType] = eventCallback;
  }

}