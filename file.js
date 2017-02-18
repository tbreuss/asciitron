/**
 * Created by thomas on 18.02.17.
 */
export default function () {

    var fs = require('fs') // Load the File System to execute our common tasks (CRUD)

    fs.readFile(filepath, 'utf-8', function (err, data) {
        if(err){
            alert("An error ocurred reading the file :" + err.message)
            return
        }
        // Change how to handle the file content
        // console.log("The file content is : " + data);
        //mainWindow.webContents.send('replace-content', data)

        //var editor = document.getElementById('editor');
        //editor.innerText = data;
    })

}
