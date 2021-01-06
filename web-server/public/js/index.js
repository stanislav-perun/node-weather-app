console.log('javascript is loaded')

const messageOne = document.querySelector('#messageOne')
const messageTwo = document.querySelector('#messageTwo')

const weatherForm =  document.querySelector('form')

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const search = document.querySelector('input')
    const location = search.value

    messageOne.textContent = 'Loading'

    fetch('/weather?address=' + location).then((response) => {
      response.json().then((data) => {
        if(data.error){
            console.log(data.error)
            messageOne.textContent = data.error
        } else {
            console.log(data.location)
            console.log(data.forecast)
            messageOne.textContent = data.location
            messageTwo.textContent = data.forecast        }
    })
})



    console.log(location)
})

