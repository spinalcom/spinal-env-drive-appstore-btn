/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

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
    super("ST_APPLIST", "ST App list",
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
    let location = "/html/spinaltwin/?path=" + cryptAes(k, path);
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
