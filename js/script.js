const addTaskBtn = document.getElementById("addTask");
const taskInput = document.getElementById("taskInput");
const taskList = document.querySelector(".task-list");
const ul = document.querySelector(".task-list ul");

taskInput.addEventListener("keypress", function (event) {
  // If the user presses the Enter key
  if (event.key == "Enter") {
    // Trigger the add button click to add task
    addTaskBtn.click();
  }
});

addTaskBtn.addEventListener("click", function () {
  if (taskInput.value.trim() == "" || null) {
    // Show alert if input isn't filled
    alert("Please fill the input!");
  } else {
    // Create a local storage item for the task length if it doesn't already exist
    if (localStorage.getItem("length") == null) {
      localStorage.setItem("length", 0);
    }

    fixIdCheckbox(
      document.querySelectorAll(".input-checkbox"),
      document.querySelectorAll(".label-checklist")
    );

    let storageItemLength = parseInt(localStorage.getItem("length"));

    // Add new task if input is filled
    task(storageItemLength, taskInput.value.trim());

    // Save the task to local storage
    localStorage.setItem(`value${storageItemLength}`, taskInput.value.trim());

    // Clear the input field
    taskInput.value = "";

    // Update the task length
    localStorage.removeItem("length");
    localStorage.setItem("length", storageItemLength + 1);
  }
});

// Reset and update the checkbox id
const fixIdCheckbox = (input, label) => {
  for (index = 0; index < parseInt(localStorage.getItem("length")); index++) {
    if (input[index].getAttribute("id") != index) {
      label[index].setAttribute("for", `checklist${index}`);
      input[index].setAttribute("id", `checklist${index}`);
    }
  }
};

// Add new task
const task = (counter, value) => {
  const ulTask = document.querySelector(".task-list > ul");
  const liTask = document.createElement("li");

  const taskCheckbox = document.createElement("span");
  taskCheckbox.classList.add("task-checkbox");

  const inputCheckbox = document.createElement("input");
  inputCheckbox.setAttribute("type", "checkbox");
  inputCheckbox.setAttribute("name", "checklist");
  inputCheckbox.setAttribute("id", `checklist${counter}`);
  inputCheckbox.classList.add("input-checkbox");

  const labelChecklist = document.createElement("label");
  labelChecklist.setAttribute("for", `checklist${counter}`);
  labelChecklist.classList.add("label-checklist");

  const taskContent = document.createElement("input");
  taskContent.setAttribute("type", "text");
  taskContent.setAttribute("readonly", true);
  taskContent.setAttribute("name", "task-content");
  taskContent.classList.add("task-content");
  taskContent.value = value;

  const remove = document.createElement("button");
  remove.classList.add("remove");
  remove.innerHTML = "&times;";

  ulTask.append(liTask);
  liTask.append(taskCheckbox);
  taskCheckbox.append(inputCheckbox);
  taskCheckbox.append(labelChecklist);
  liTask.append(taskContent);
  liTask.append(remove);
};

// Remove task
taskList.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove")) {
    let currentIndex = Array.from(ul.children).indexOf(
      event.target.parentElement
    );

    // Remove selected task from local storage
    localStorage.removeItem(`value${currentIndex}`);

    let storageItemLength = parseInt(localStorage.getItem("length"));

    // Remove the checked data from local storage
    if (event.target.previousSibling.previousSibling.children[0].checked) {
      localStorage.removeItem("checked" + currentIndex);
      for (let index = currentIndex + 1; index < storageItemLength; index++) {
        if (ul.children[index].children[0].children[0].checked) {
          localStorage.removeItem(`checked${index}`);
          localStorage.setItem(`checked${index - 1}`, index - 1);
        }
      }
    }

    // Reduce the checked data index from local storage
    if (!event.target.previousSibling.previousSibling.children[0].checked) {
      for (let index = currentIndex; index < storageItemLength; index++) {
        if (ul.children[index].children[0].children[0].checked) {
          localStorage.removeItem(`checked${index}`);
          localStorage.setItem(`checked${index - 1}`, index - 1);
        }
      }
    }

    // Remove the task from the browser
    ul.removeChild(event.target.parentElement);

    localStorage.removeItem("length");
    localStorage.setItem("length", storageItemLength - 1);

    // Remove the task length from local storage if there are no task left
    if (ul.children.length == 0) {
      localStorage.removeItem("length");
    }

    // Update the task key from local storage
    for (let index = 0; index < storageItemLength; index++) {
      localStorage.removeItem(`value${index}`);
    }
    for (let index = 0; index < storageItemLength - 1; index++) {
      localStorage.setItem(
        `value${index}`,
        ul.children[index].children[1].value
      );
    }
  }
});

// Check the checkbox
taskList.addEventListener("click", function (event) {
  // If the user presses the checkbox
  if (event.target.parentElement.classList.contains("task-checkbox")) {
    const checkedIndex = Array.from(ul.children).indexOf(
      event.target.parentElement.parentElement
    );

    // If the user checked the checkbox
    if (
      event.target.checked &&
      !event.target.parentElement.classList.contains("checked")
    ) {
      // Add the class to checkbox container
      event.target.parentElement.classList.add("checked");

      // Crossout the checked task
      ul.children[checkedIndex].children[1].style.textDecoration =
        "line-through";

      // Save the checked index to local storage
      localStorage.setItem("checked" + checkedIndex, checkedIndex);
    }

    // If the user checked the checkbox
    if (
      !event.target.checked &&
      event.target.parentElement.classList.contains("checked")
    ) {
      // Remove the class of the checkbox container
      event.target.parentElement.classList.remove("checked");

      // Uncrossout the unchecked task
      ul.children[checkedIndex].children[1].style.textDecoration = "inherit";

      // Remove the checked index to local storage
      localStorage.removeItem("checked" + checkedIndex);
    }
  }
});

// Restore the task list if not empty
if (parseInt(localStorage.getItem("length")) != 0) {
  for (index = 0; index < parseInt(localStorage.getItem("length")); index++) {
    // Restore the task list
    task(index, localStorage.getItem(`value${index}`));

    // Restore the checked task
    if (localStorage.getItem(`checked${index}`)) {
      ul.children[index].children[0].classList.add("checked");
      ul.children[index].children[0].children[0].checked = true;
      ul.children[index].children[1].style.textDecoration = "line-through";
    }
  }
}

// Event listener if storage changed manually
addEventListener("storage", () => {
  if (localStorage.getItem("length") == null && ul.children.length != 0) {
    // if the task length has been deleted from localstorage, clear all localStorage object item and then refresh the browser
    localStorage.clear();
    location.reload();
  }

  // if the task has been deleted from localstorage, trigger the remove button click to remove selected item and then refresh the browser
  for (index = 0; index < parseInt(localStorage.getItem("length")); index++) {
    if (localStorage.getItem(`value${index}`) == null) {
      ul.children[index].children[2].click();
      location.reload();
    }
  }

  location.reload();
});
