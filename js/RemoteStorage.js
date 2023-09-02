
async function post({ url, data }) {
  var resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  var json = await resp.json();
  return json;
}


export const RemoteStorage = function({prefix, url}) {
  
  
  if (!prefix) { 
    throw new Error('configuration error: RemoteStorage needs prefix'); 
  };
  if (!url) {
    throw new Error('no url');
  }
  var self = {};  
  
  self.setItem = function(k,v) {
    var data = { key: prefix+k, value: v };
    fetch(`${url}/set-item`, { method: 'POST', body: JSON.stringify(data) })
  };
  self.getItem = function(k,cb) {
    fetch(`${url}/get-item?key=${prefix+k}`)
      .then(async resp => cb(null, await resp.text()))
      .catch(cb)
  };
  self.removeItem = function(k) {
    var data = { key: prefix+k };
    fetch(`${url}/remove-item`, { method: 'POST', body: JSON.stringify(data) })
  };
  self.clear = function() {
    return "clear: not yet implemented";
  }
  
  return self;
};

export default RemoteStorage;