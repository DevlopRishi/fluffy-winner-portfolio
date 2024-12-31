const outputDiv = document.querySelector('.output-container');
const inputField = document.querySelector('.cli-input');

const fileSystem = {
    '/': {
        type: 'dir',
        children: {
            'home': {
                type: 'dir',
                children: {
                    'about': {type: 'file', content: `
🚀 About Me
-----------
I am a Srudent with a love for creating elegant solutions to complex problems. 
My journey in tech started with a curiosity about how things work, and that curiosity 
continues to drive me today.

💡 What I Do
-----------
• Learn
• Poster Design
• Do Random things

🎯 My Focus
----------
Chill and be devoted at the same time.
`},
                    'education': {type: 'file', content: `
📚 Education
-----------
🎓 10th Grade (Still ongoing)
    • New Era Progressive School Korba (2011-ongoing)
    • GPA: Can it be negetive?

🏆 Certifications
---------------
• 
• 
• 

📖 Key Coursework
---------------
• AI (More than one)
• Logic
• Design Psychology
• CS50
`},
                    'projects': {type: 'file', content: `
💻 Featured Projects
-----------------
1. CLI Portfolio
   • Interactive command-line interface portfolio
   • Custom glassmorphism design
   • Advanced command system

2. E-Commerce Platform [Next.js, Node.js]
   • Full-stack application with real-time updates
   • Integrated payment processing
   • Advanced search and filtering

3. AI Task Manager [Python, TensorFlow]
   • Smart task prioritization
   • Natural language processing
   • Automated scheduling
`},
                    'skills': {type: 'file', content: `
🛠️ Technical Skills
-----------------
Languages:
• JavaScript/TypeScript ⭐⭐⭐⭐
• Python ⭐⭐⭐⭐
• React ⭐⭐⭐
• HTML/CSS ⭐⭐⭐⭐⭐⭐

Frameworks & Tools:
• 
• 
• 
• 
• 

Soft Skills:
• N/A
`},
                    'contact': {type: 'file', content: `
📫 Contact Information
--------------------
📧 Email: gavelrishu@gmail.com
🔗 LinkedIn: 
🐙 GitHub: github.com/DevlopRishi
🌐 Website: coming soon

💬 Preferred Contact Method
------------------------
Email is the best way to reach me. I typically respond within 24 hours.
`},
                    'portfolio': {type: 'file', content: `Welcome to my portfolio! <i class="fas fa-briefcase"></i>`},
                }
            }
        }
    },
};


let currentDirectory = '/home';
let commandHistory = [];
let historyIndex = -1;

const commands = {
    help: {
        icon: 'fas fa-question-circle',
        description: 'Show available commands',
        action: () => ({
          type: 'success',
          content: `
Available Commands:
------------------
help              Show this help message
ls               List current directory
cd <dir>         Change directory
cat <file>       Display file contents
pwd              Print working directory
clear            Clear terminal
history          Show command history
tree             Display directory structure

Portfolio Commands:
-----------------
about            Display about me
education        Show education details
projects         View project showcase
skills           List technical skills
contact          Display contact information
portfolio        Show full portfolio
          `
        })
      },
    about: {
        icon: 'fas fa-user',
      action: () => ({
        type: 'info',
        content: fileSystem['/'].children['home'].children.about.content
      })
    },
    education: {
        icon: 'fas fa-graduation-cap',
      action: () => ({
        type: 'info',
        content: fileSystem['/'].children['home'].children.education.content
      })
    },
    projects: {
        icon: 'fas fa-code',
      action: () => ({
        type: 'info',
        content: fileSystem['/'].children['home'].children.projects.content
      })
    },
    skills: {
        icon: 'fas fa-tools',
      action: () => ({
        type: 'info',
        content: fileSystem['/'].children['home'].children.skills.content
      })
    },
    contact: {
         icon: 'fas fa-envelope',
      action: () => ({
        type: 'info',
        content: fileSystem['/'].children['home'].children.contact.content
      })
    },
    portfolio: {
         icon: 'fas fa-folder-open',
      action: () => ({
           type: 'info',
           content: Object.entries(fileSystem['/'].children['home'].children)
          .map(([key, value]) => `${value.content}<br>${'='.repeat(40)}<br>`)
          .join('\n')
      })
    },
  };

function getPathString(pathArray) {
    return pathArray.join('/');
}

function getCurrentPath() {
  const pathArray = currentDirectory.split('/').filter(Boolean); // split and filter empty strings
    if (pathArray.length === 0) return '/'; // Check for root
  return '/' + pathArray.join('/');
}

function resolvePath(path){
  const pathArray = path.split('/').filter(Boolean);
  const resolvedPath = currentDirectory.split('/').filter(Boolean);
  for(const part of pathArray){
    if(part === '..'){
      resolvedPath.pop();
    } else if (part !== '.'){
      resolvedPath.push(part);
    }
  }
  return '/' + resolvedPath.join('/');
}

function getFileOrDir(path) {
    let current = fileSystem;
    const pathArray = path.split('/').filter(Boolean);

    for(const part of pathArray) {
        if (current && current.children && current.children[part]){
            current = current.children[part];
        }else{
            return undefined;
        }
    }
    return current;
}


function executeCommand(command) {
    const parts = command.trim().split(/\s+/);
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1);
  
      if(commands[mainCommand]){
           const result = commands[mainCommand].action(args);
           outputDiv.innerHTML += `<div class="${result.type}"><pre>${result.content}</pre></div>`;
        } else {
            switch(mainCommand) {
              case 'clear':
                  handleClearCommand(args);
                break;
              case 'ls':
                  handleLsCommand();
                break;
              case 'cd':
                  handleCdCommand(args[0]);
                break;
              case 'cat':
                handleCatCommand(args[0]);
                 break;
              case 'pwd':
                handlePwdCommand();
                  break;
              case 'tree':
                    handleTreeCommand();
                  break;
              case 'history':
                  handleHistoryCommand();
                break;
              default:
                outputDiv.innerHTML += `<div class="error">Error: Command not found</div>`;
                }
        }
 }

function handleClearCommand(args) {
    if (args[0] === '--all') {
        document.querySelector('.banner').style.display = 'none';
    }
    outputDiv.innerHTML = '';
}

function handleLsCommand() {
    const currentDir = getFileOrDir(currentDirectory);
      if (currentDir && currentDir.type === 'dir'){
        const items = Object.keys(currentDir.children)
        outputDiv.innerHTML += `<div>${items.map(item => `<span class="keyword-glow">${item}</span>`).join(' ') || 'No files or folders here.'}</div>`;
      } else{
        outputDiv.innerHTML += `<div class="error">Error: Not a directory</div>`;
    }
}

function handleCdCommand(arg) {
    if(!arg){
        outputDiv.innerHTML += `<div class="error">Error: Please provide directory name</div>`
        return;
    }
  const targetPath = resolvePath(arg);
  const targetDir = getFileOrDir(targetPath);

    if (targetDir && targetDir.type === 'dir') {
        currentDirectory = targetPath;
        outputDiv.innerHTML += `<div class="success">Changed directory to ${getCurrentPath()}</div>`;
    } else {
        outputDiv.innerHTML += `<div class="error">Error: Directory not found</div>`;
    }
}

function handleCatCommand(arg){
    if(!arg){
        outputDiv.innerHTML += `<div class="error">Error: Please provide file name</div>`
        return;
    }
    const targetPath = resolvePath(arg);
    const targetFile = getFileOrDir(targetPath);
  
    if(targetFile && targetFile.type === 'file'){
      outputDiv.innerHTML += `<div>${targetFile.content}</div>`
    }
    else if(targetFile && targetFile.type === 'dir'){
         outputDiv.innerHTML += `<div class="error">Error: ${arg} is a directory</div>`
    }
    else{
       outputDiv.innerHTML += `<div class="error">Error: File not found</div>`;
    }
}
function handlePwdCommand(){
    outputDiv.innerHTML += `<div>${getCurrentPath()}</div>`;
}

function handleTreeCommand(){
     function traverse(node, indent = '') {
        let output = '';
        if (node.type === 'dir') {
          output += `${indent}<i class="fas fa-folder icon"></i> <span class="keyword-glow">${Object.keys(node.children)[0] ? Object.keys(node.children)[0] : 'root'} </span>\n`;
          for (const key in node.children) {
            output += traverse(node.children[key], indent + '  ');
          }
        } else if (node.type === 'file') {
          output += `${indent}  <i class="fas fa-file icon"></i> <span class="keyword-glow">${Object.keys(node)[0]}</span>\n`;
         }
        return output;
      }
        let output = traverse(fileSystem);
        outputDiv.innerHTML += `<div>${output}</div>`;
}

function handleHistoryCommand(){
    outputDiv.innerHTML += `<div>${commandHistory.map(command => `<span class="command">${command}</span><br>`).join('')}</div>`;
}

function handleCommand(input) {
    commandHistory.push(input);
    historyIndex = -1;
    outputDiv.innerHTML += `<div><span class="prompt">λ :: ${getCurrentPath()} >> </span><span class="command">${input}</span></div>`;
  executeCommand(input);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}
function handleKeyDown(e) {
  if (e.key === 'Enter') {
      const input = e.target.value.trim();
      if (input) {
        handleCommand(input);
          e.target.value = '';
      }
  } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          historyIndex = newIndex;
          inputField.value = commandHistory[commandHistory.length - 1 - newIndex];
      }
  } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
          historyIndex = newIndex;
          inputField.value = commandHistory[commandHistory.length - 1 - newIndex];
      } else if (historyIndex === 0) {
        historyIndex = -1;
          inputField.value = '';
      }
  }
}

inputField.addEventListener('keydown', handleKeyDown);