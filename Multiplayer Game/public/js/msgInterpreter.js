msg = {
  isOpen: false,
  history: [],
  focusIndex: 0,
  open: ()=> {
    if (settings.allowCheats) {
      msg.isOpen = document.querySelector(".msg").style.display == "block" ? true : false
      msg.isOpen = !msg.isOpen

      document.querySelector(".msg").style.display = msg.isOpen?"block":"none";
      if(msg.isOpen) document.querySelector(".msg-input").focus()
    }
  },
  run: presetCode => {
    if (settings.allowCheats) {
      if (presetCode[0] == '#' || presetCode[0] == '*') {
        sendMessage(`notify(\"${presetCode.slice(1)}\"\)`)
      } else if (presetCode[0] == "!" && presetCode[presetCode.length - 1] == "!") {
        if (presetCode == "!clear!") msg.clear()
      } else {
        msg.out(eval(presetCode))
      }
      msg.history.push(presetCode)
      msg.focusIndex = msg.history.length - 1
      document.querySelector(".msg-input").value = ""
    }
  },
  confirm: e => {
    if (e.keyCode == 13)
      msg.run(document.querySelector(".msg-input").value)
  },
  listener: () => {
    if (window.localStorage.mods) {
      let mods = window.localStorage.mods.split(";")
      for (let i in mods) {
        install(mods[i])
      }
    }
    document.querySelector(".msg-input").addEventListener("keydown", e => {
      if (e.keyCode == 13)
        msg.run(document.querySelector(".msg-input").value)
      else if (e.keyCode == 38) {
        msg.focusIndex--;
        if (msg.focusIndex < 0) msg.focusIndex = msg.history.length-1;
        document.querySelector(".msg-input").value = msg.history[msg.focusIndex]
      } else if (e.keyCode == 40) {
        msg.focusIndex++;
        if (msg.focusIndex > msg.history.length-1) msg.focusIndex = 0;
        document.querySelector(".msg-input").value = msg.history[msg.focusIndex]
      }
    })
  },
  out: str => {
    document.querySelector(".output").innerHTML += "<br>"+str;
  },
  clear: () => {
    document.querySelector(".output").innerHTML = ""
  }
}
function install(url) {
  window.localStorage.mods += ";"+url
  var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
    return "Install Success";
}
