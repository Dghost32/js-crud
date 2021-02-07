const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const taskContainer = document.getElementById("task-container");

state = {
  edit: false,
  id: "",
};

const saveTask = (title, description) => {
  const res = db.collection("tasks").doc().set({
    title,
    description,
  });
};

const getTasks = () => db.collection("tasks").get();

const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);

const deleteTask = (id) => db.collection("tasks").doc(id).delete();

const updateTask = (id, newTask) =>
  db.collection("tasks").doc(id).update(newTask);

const getTask = (id) => db.collection("tasks").doc(id).get();

/* add tasks */
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let title = taskForm["task-title"];
  let description = taskForm["task-description"];

  if (!state.edit) await saveTask(title.value, description.value);
  else {
    await updateTask(this.state.id, {
      title: title.value,
      description: description.value,
    });
    this.state.edit=false;
    taskForm["btn-task-form"].innerText = "save";
  }
  console.log(state);

  await getTasks();

  taskForm.reset();
  title.focus();
});

/* onLoad */
window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    taskContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      taskContainer.innerHTML += `<div class = "card card-body mt-2 border-primary">
          <h3 class="h5">${task.title}</h3>
          <p>${task.description}</p>
          <div>
            <button class="btn btn-primary btn-edit" data-id="${doc.id}"> edit </button>
            <button class="btn btn-secondary btn-delete" data-id="${doc.id}"> delete </button>
          </div>
          </div>`;
    });
    const btnsDelete = document.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) => {
      btn.addEventListener(
        "click",
        async (e) => await deleteTask(e.target.dataset.id)
      );
    });

    const btnsEdit = document.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btnEdit) => {
      btnEdit.addEventListener("click", async (e) => {
        const doc = await getTask(e.target.dataset.id);
        const task = doc.data();

        console.log(task);
        taskForm["task-title"].value = task.title;
        taskForm["task-description"].value = task.description;
        taskForm["btn-task-form"].innerText = "update";
        this.state.edit = true;
        this.state.id = doc.id;
      });
    });
  });
});
