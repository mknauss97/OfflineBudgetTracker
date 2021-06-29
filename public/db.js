let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("budgetStore", {
        autoIncrement: true
    });
};

request.onsuccess = function (event) {
    console.log("There was an error" + event.target.errorCode + ".");
};

function saveTransaction(record) {
    const transaction = db.transaction(["budgetStore"], "readwrite");
    const storage = transaction.createObjectStore("budgetStore");
    storage.add(record);
};

function checkDB() {
    const transaction = db.transaction(["budgetStore"], "readwrite");
    const storage = transaction.createObjectStore("budgetStore");
    const getAll = storage.getAll();

    getAll.onsucces = () => {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["budgetStore"], "readwrite");
                const storage = transaction.objectStore("budgetStore");
                storage.clear();
            });
        }
    };
};

window.addEventListener("online", checkDB);