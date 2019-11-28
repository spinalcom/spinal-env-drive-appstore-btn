import {
  SpinalDrive_App
} from "spinal-env-drive-core";
var aesjs = require('aes-js');

let spinalDrive_Env = window.spinalDrive_Env;

function cryptAes(k, path) {
  var textBytes = aesjs.utils.utf8.toBytes(path);
  var aesCtr = new aesjs.ModeOfOperation.ctr(k, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);
  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

class SpinalOpenDashboard extends SpinalDrive_App {
  constructor() {
    super("ST APPLIST", "Open ST APPLIST",
      "ST_APPLIST",
      "apps");
  }

  action(obj) {
    let authService = obj.scope.injector.get("authService");
    let fs_path = obj.scope.fs_path;
    let username = authService.get_user().username;
    let path = "/__users__/" + username;
    for (var i = 1; i < fs_path.length; i++) {
      path += "/" + fs_path[i].name;
    }
    path += "/" + obj.file.name;
    let myWindow = window.open("", "");
    const k = [10, 95, 124, 68, 55, 24, 90, 57, 34, 65, 81, 22, 75, 7, 110,
      1
    ];
    let location = "/html/appstore/?path=" + cryptAes(k, path);
    myWindow.document.location = location;
    myWindow.focus();
  }
  is_shown(d) {
    if (d && d.file && d.file._server_id) {
      let file = window.FileSystem._objects[d.file._server_id];
      if (
        file &&
        file instanceof File &&
        file._info.model_type &&
        (file._info.model_type.get() === "BIM Project" ||
          file._info.model_type.get() === "Digital twin")
      ) {
        return true;
      }
    }
    return false;
  }

}

spinalDrive_Env.add_applications('FileExplorer', new SpinalOpenDashboard());