import React, { useState } from 'react';

const File = ({ name, onDelete }) => {
  return (
    <div className="file">
      {name}
      <span className="delete-button" onClick={() => onDelete(name)}>
        &#x2715;
      </span>
    </div>
  );
};

const Folder = ({ name, content, depth, onToggle, onAddFile, onAddFolder, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
    onToggle(name);
  };

  const handleAddFile = () => {
    const fileName = prompt('Enter the file name:');
    if (fileName) {
      onAddFile(name, fileName);
    }
  };

  const handleAddFolder = () => {
    const folderName = prompt('Enter the folder name:');
    if (folderName) {
      onAddFolder(name, folderName);
    }
  };

  return (
    <div className={`folder depth-${depth}`} style={depth > 1 ? { marginLeft: '10px' } : {}}>
      <div className="folder-header" onClick={handleToggle}>
        <span className={`arrow ${expanded ? 'expanded' : 'collapsed'}`}>&#x25B6;</span>
        {name}
      </div>
      {expanded && (
        <div className="folder-content">
          {content.map(item => {
            if (typeof item === 'string') {
              return <File key={item} name={item} onDelete={onDelete} />;
            } else {
              const subFolderName = Object.keys(item)[0];
              const subFolderContent = Object.values(item)[0];
              return (
                <Folder
                  key={subFolderName}
                  name={subFolderName}
                  content={subFolderContent}
                  depth={depth + 1}
                  onToggle={onToggle}
                  onAddFile={onAddFile}
                  onAddFolder={onAddFolder}
                  onDelete={onDelete}
                />
              );
            }
          })}
          <div className="add-buttons">
            <button onClick={handleAddFile}>Add File</button>
            <button onClick={handleAddFolder}>Add Folder</button>
          </div>
        </div>
      )}
    </div>
  );
};

const FolderTree = ({ data }) => {
  const [treeData, setTreeData] = useState(data);

  const handleFolderToggle = folderName => {
    const newData = [...treeData];
    const folderToUpdate = newData.find(folder => Object.keys(folder)[0] === folderName);
    folderToUpdate[folderName].expanded = !folderToUpdate[folderName].expanded;
    setTreeData(newData);
  };

  const addFileOrFolder = (folderName, itemToAdd, isFile) => {
    const newData = treeData.map(folderObj => {
      const newFolderObj = { ...folderObj };
      if (Object.keys(folderObj)[0] === folderName) {
        const content = folderObj[folderName];
        if (isFile) {
          content.push(itemToAdd);
        } else {
          content.push({ [itemToAdd]: [] });
        }
        newFolderObj[folderName] = content;
      }
      return newFolderObj;
    });
    setTreeData(newData);
  };

  const handleAddFile = (folderName, fileName) => {
    addFileOrFolder(folderName, fileName, true);
  };

  const handleAddFolder = (folderName, folderToAdd) => {
    addFileOrFolder(folderName, folderToAdd, false);
  };

  const handleDelete = (parentFolderName, itemToDelete) => {
    const newData = treeData.map(folderObj => {
      const newFolderObj = { ...folderObj };
      if (Object.keys(folderObj)[0] === parentFolderName) {
        const content = folderObj[parentFolderName].filter(item => item !== itemToDelete);
        newFolderObj[parentFolderName] = content;
      }
      return newFolderObj;
    });
    setTreeData(newData);
  };

  return (
    <div className="folder-tree">
      {treeData.map(folderObj => {
        const folderName = Object.keys(folderObj)[0];
        const folderContent = folderObj[folderName];
        return (
          <Folder
            key={folderName}
            name={folderName}
            content={folderContent}
            depth={1}
            onToggle={handleFolderToggle}
            onAddFile={handleAddFile}
            onAddFolder={handleAddFolder}
            onDelete={(itemName) => handleDelete(folderName, itemName)}
          />
        );
      })}
    </div>
  );
};

const App = () => {
  const jsonData = [
    {
      Documents: ['Document1.jpg', 'Document2.jpg', 'Document3.jpg'],
    },
    {
      Desktop: ['Screenshot1.jpg', 'videopal.mp4'],
    },
    {
      Downloads: [
        { Drivers: ['Printerdriver.dmg', 'cameradriver.dmg'] },
        { Applications: ['Webstorm.dmg', 'Pycharm.dmg', 'FileZila.dmg', 'Mattermost.dmg'] },
        'chromedriver.dmg',
      ],
    },
  ];

  return (
    <div className="app">
      <h1>File Explorer</h1>
      <FolderTree data={jsonData} />
    </div>
  );
};

export default App;
