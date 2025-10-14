const fs=require('fs');
const s=fs.readFileSync('src/app/resume-builder/build/page.tsx','utf8');
const pairs={')':'(',']':'[','}':'{'};
const opens=['(','[','{'];
let stack=[];
for(let i=0;i<s.length;i++){
  const c=s[i];
  if(opens.includes(c)) stack.push({c, i});
  else if(pairs[c]){
    if(stack.length===0||stack[stack.length-1].c!==pairs[c]){
      const line = s.slice(0,i).split('\n').length;
      const col = i - s.lastIndexOf('\n', i-1);
      console.log('First mismatch at', {char:c, index:i, line, col});
      process.exit(0);
    } else stack.pop();
  }
}
if(stack.length){
  const {i}=stack[stack.length-1];
  const line = s.slice(0,i).split('\n').length;
  const col = i - s.lastIndexOf('\n', i-1);
  console.log('Unclosed open at', {char:stack[stack.length-1].c, index:i, line, col});
} else {
  console.log('All (),[],{} balanced by naive scan');
}
