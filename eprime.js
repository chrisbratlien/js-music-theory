function convertToHTMLIfRequired(c){

 var map = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;'	
 };

if (typeof(map[c]) == 'undefined')
  return c;
else
  return map[c];	

}
