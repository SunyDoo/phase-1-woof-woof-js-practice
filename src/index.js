document.addEventListener('DOMContentLoaded', ()=>{
    const dogFilter = document.getElementById('good-dog-filter')
    const dogBar = document.getElementById('dog-bar')
    getAllDogs().then(renderAllDogs)
//fetch function to get all dogs
    function getAllDogs(){
        return fetch('http://localhost:3000/pups')
        .then (res=>res.json())
        // .then (data => renderAllDogs(data))        
    }
    function renderAllDogs(dogArr, filter = false){
        dogBar.innerHTML=''
        if (filter){
            dogArr.filter(dogObj=>dogObj.isGoodDog).forEach(renderOneDogName)  
        }
        else {
            dogArr.forEach(renderOneDogName)
        }
    }
//function to render dogs to page
    function renderOneDogName(dogObj){       
        const dogName = document.createElement('span')
        dogBar.appendChild(dogName)
        dogName.innerText = `${dogObj.name}`   
//event listener for dog bar
        dogName.addEventListener('click', displayDog)
        function displayDog(){
            const dogInfo = document.getElementById('dog-info')
            dogInfo.innerHTML=`
                <img src="${dogObj.image}" class="dog-pic" />
                <h2>${dogObj.name}</h2>
                <button id="dog-btn">Good Dog!</button>
            `
//event listener for good dog button
            const dogBtn = document.getElementById('dog-btn')
            dogBtn.addEventListener('click',behavior)
            function behavior(e){
                if (e.target.innerText == 'Good Dog!'){
                    e.target.innerText = 'Bad Dog!'
                    dogObj.isGoodDog = false
                }
                else if (e.target.innerText == 'Bad Dog!'){
                    e.target.innerText = 'Good Dog!'
                    dogObj.isGoodDog = true
                }
//patch good dog to server
                fetch (`http://localhost:3000/pups/${dogObj.id}`,{
                    method: 'PATCH',
                    headers:{
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify(dogObj)
                })
                .then(res=>res.json())
                .then(pups=>console.log(pups))               
            }
        }
    }
//event listener for good dog filter
    dogFilter.addEventListener('click', toggleFilter)
    function toggleFilter(e){
        if (e.target.innerText == 'Filter good dogs: OFF'){
            e.target.innerText = 'Filter good dogs: ON'
            getAllDogs().then(dogArr=>renderAllDogs(dogArr, true))       
        }
        else if (e.target.innerText == 'Filter good dogs: ON'){
            e.target.innerText = 'Filter good dogs: OFF'
            getAllDogs().then(renderAllDogs)            
        }
    }
})





