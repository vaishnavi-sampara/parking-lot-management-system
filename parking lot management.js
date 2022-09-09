
      //Entry Class: Represent each entry in the parking lot
class Entry{
    constructor(owner,vehicle,licensePlate,entryDate,entryTime,exitDate,exitTime){
        this.owner = owner;
        this.vehicle = vehicle;
        this.licensePlate = licensePlate;
        this.entryDate = entryDate;
        this.entryTime = entryTime;
        this.exitDate = exitDate
        this.exitTime = exitTime;
    }
}
//UI Class: Handle User Interface Tasks
class UI{
    static displayEntries(){
   
        const entries = Store.getEntries();
        entries.forEach((entry) => UI.addEntryToTable(entry));
    }
    static addEntryToTable(entry){
        const tableBody=document.querySelector('#tableBody');
        const row = document.createElement('tr');
        row.innerHTML = `   <td>${entry.owner}</td>
                            <td>${entry.vehicle}</td>
                            <td>${entry.licensePlate}</td>
                            <td>${entry.entryDate}</td>
                            <td>${entry.entryTime}</td>
                            <td>${entry.exitDate}</td>
                            <td>${entry.exitTime}</td>
                            <td><button class="btn btn-danger delete">X</button></td>
                        `;
        tableBody.appendChild(row);
    }
    static clearInput(){
        //Selects all the inputs
        const inputs = document.querySelectorAll('.form-control');
        //Clear the content of each input
        inputs.forEach((input)=>input.value="");
    }
    static deleteEntry(target){
        if(target.classList.contains('delete')){
            target.parentElement.parentElement.remove();
        }
    }
    static showAlert(message,className){
        const div = document.createElement('div');
        div.className=`alert alert-${className} w-50 mx-auto`;
        div.appendChild(document.createTextNode(message));
        const formContainer = document.querySelector('.form-container');
        const form = document.querySelector('#entryForm');
        formContainer.insertBefore(div,form);
        setTimeout(() => document.querySelector('.alert').remove(),3000);
    }
    static validateInputs(){
        const owner = document.querySelector('#owner').value;
        const vehicle = document.querySelector('#vehicle').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const entryTime = document.querySelector('#entryTime').value;
        const exitDate = document.querySelector('#exitDate').value;
        const exitTime = document.querySelector('#exitTime').value;
        var licensePlateRegex = /^(?:[A-Z]{2}-\d{2}-\d{2})|(?:\d{2}-[A-Z]{2}-\d{2})|(?:\d{2}-\d{2}-[A-Z]{2})$/;
        if(owner === '' || vehicle === '' || licensePlate === '' || entryDate === '' || entryTime === '' || exitDate === '' || exitTime === ''){
            UI.showAlert('All fields must me filled!','danger');
            return false;
        }
        if(exitDate < entryDate){
            UI.showAlert('Exit date cannot be lower than Entry date','danger');
            return false;
        }
        
        return true;
    }
}
//Store Class: Handle Local Storage
class Store{
    static getEntries(){
        let entries;
        if(localStorage.getItem('entries') === null){
            entries = [];
        }
        else{
            entries = JSON.parse(localStorage.getItem('entries'));
        }
        return entries;
    }
    static addEntries(entry){
        const entries = Store.getEntries();
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
    }
    static removeEntries(licensePlate){
        const entries = Store.getEntries();
        entries.forEach((entry,index) => {
            if(entry.licensePlate === licensePlate){
                entries.splice(index, 1);
            }
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }
}
//Event Display
    document.addEventListener('DOMContentLoaded',UI.displayEntries);
//Event Add
    document.querySelector('#entryForm').addEventListener('submit',(e)=>{
        e.preventDefault();
        
        //Declare Variables
        const owner = document.querySelector('#owner').value;
        const vehicle = document.querySelector('#vehicle').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const entryTime = document.querySelector('#entryTime').value;
        const exitDate = document.querySelector('#entryDate').value;
        const exitTime = document.querySelector('#exitTime').value;
        if(!UI.validateInputs()){
            return;
        }
        //Instatiate Entry
        const entry = new Entry(owner, vehicle, licensePlate, entryDate, entryTime, exitDate, exitTime);
        //Add the entry do de UI table
        UI.addEntryToTable(entry);
        Store.addEntries(entry);
        //Delete content of input's
        UI.clearInput();

        UI.showAlert('Vehicle successfully added to the parking lot','success');

    });
//Event Remove
    document.querySelector('#tableBody').addEventListener('click',(e)=>{
        //Call to UI function that removes entry from the table
        UI.deleteEntry(e.target);
        //Get license plate to use as unique element of an entry
        var licensePlate = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        //Call to Store function to remove entry from the local storage
        Store.removeEntries(licensePlate);
        //Show alert that entry was removed
        UI.showAlert('Vehicle successfully removed from the parking lot list','success');
    })

//Event Search
    document.querySelector('#searchInput').addEventListener('keyup', function searchTable(){
        //Get value of the input search
        const searchValue = document.querySelector('#searchInput').value.toUpperCase();
        //Get all lines of table body
        const tableLine = (document.querySelector('#tableBody')).querySelectorAll('tr');
        //for loop #1 (used to pass all the lines)
        for(let i = 0; i < tableLine.length; i++){
            var count = 0;
            //Get all collumns of each line
            const lineValues = tableLine[i].querySelectorAll('td');
            //for loop #2 (used to pass all the collumns)
            for(let j = 0; j < lineValues.length - 1; j++){
                //Check if any collumn of the line starts with the input search string
                if((lineValues[j].innerHTML.toUpperCase()).startsWith(searchValue)){
                    count++;
                }
            }
            if(count > 0){
                //If any collumn contains the search value the display block
                tableLine[i].style.display = '';
            }else{
                //Else display none 
                tableLine[i].style.display = 'none';
            }
        }
    });

