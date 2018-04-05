notifications = []

function notify(value) {
  notifications.push(new notification(value, notifications.length))
}

class notification {
  constructor(val, i) {
    this.val = val
    this.index = i

    let tmp = document.querySelector(".notification").cloneNode(true)
    tmp.index = this.index
    // console.log(tmp.index);
    tmp.style.display = "block"
    tmp.firstChild.innerHTML = this.val
    document.querySelector(".notifications").appendChild(tmp)
    // console.log("ID CHECK: " + document.querySelectorAll(".notification")[document.querySelectorAll(".notification").length - 1].index)
  }
  close() {
    for (let i in document.querySelectorAll(".notification")) {
      let a = document.querySelectorAll(".notification")[i]
      if (a.index == this.index) {
        a.outerHTML = ""
      }
    }

    notifications.splice(this.index, 1)
  }
}

function closeNotification(item) {
  notifications[item.index].close()
}
