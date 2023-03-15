window.addEventListener('load', () => {
    while(data.length != 10){
        placeResults()
    }
    
    body.style.filter = 'blur(0px)'
    body.style.backdropFilter = 'blur(0px)'
})

document.addEventListener('click', async () => {
    if(!gameStarted){
        gameStarted = true
        await new Promise(resolve => setTimeout(resolve, 500))
        bgMusic.play()
        inputString.innerHTML = ''
        triggerCountdown()
        document.querySelectorAll('.alphabetic-key span').forEach(elem => elem.style.opacity = '1')
        keysAllowed = true
    }
})


backspaceKey.addEventListener('click', () => {
    if(keysAllowed && inputString.innerHTML.length > 0){
        inputString.innerHTML = inputString.innerHTML.slice(0, inputString.innerHTML.length - 1)
        backspaceKeyImg.style.filter = 'brightness(50%)'
        new Audio('backspace.mp3').play()
    }
})

spaceKey.addEventListener('click', () => {
    if (keysAllowed && inputString.innerHTML.length >= 3) {
        spaceKeyImg.style.filter = 'brightness(50%)'
        let correct = false
        
        data.forEach((object) => {
            if(object.result == inputString.innerHTML.toLowerCase() && !solved.includes(inputString.innerHTML.toLowerCase())){
                correct = true
                scoreText.innerHTML = Number(scoreText.innerHTML) + (object.result.length * 10)
                new Audio('correct.mp3').play()
                scoreText.style.color = 'lime'
                scoreText.animate(
                    [{color: 'lime'}, {color: 'white'}],
                    {duration: 3000, easing: 'linear', fill: 'forwards'}
                )
                
                object.occupied.forEach((cellNo) => {
                    let blocksArray = getBlocksAtCellNo(cellNo)
                    if(blocksArray.length == 1){
                        blocksArray[0].style.transform = 'scale(1)'
                    } else if(blocksArray.length == 2) {
                        if(blocksArray[0].style.transform == 'scale(0)'){
                            blocksArray[0].style.transform = 'scale(1)'
                        } else {
                            blocksArray[1].style.transform = 'scale(1)'
                        }
                    }
                })
                
                solved.push(object.result)
                
                if(solved.length == 10){
                    bgMusic.pause()
                    new Audio('win.mp3').play()
                    clearInterval(countdownID)
                    scoreValue.innerHTML = Number(scoreValue.innerHTML) + Number(countdown.innerHTML) + 1000
                }
            }
        })
        
        !correct && new Audio('wrong.mp3').play()
        inputString.innerHTML = ''
    }
})

alphaKeys.forEach((key) => {
    key.addEventListener('click', () => {
        if(keysAllowed && inputString.innerHTML.length != 6){
            inputString.innerHTML = inputString.innerHTML + key.innerText
            key.style.filter = 'brightness(50%)'
            new Audio("keyPress.mp3")
        }
    })
})

document.ontouchend = () => {
    alphaKeys.forEach((key) => {
        key.style.filter = 'brightness(100%)'
    })
    
    backspaceKeyImg.style.filter = 'brightness(100%)'
    spaceKeyImg.style.filter = 'brightness(100%)'
}

quit.addEventListener('click', () => {
    gameOver()
})

next.addEventListener("click", async() => {
    if(keysAllowed && (solved.length == 10 || skips != 0)){
        solved.length != 0 && skips++
        solved = []
        inputString.innerHTML = ''
        clearInterval(countdownID)
        keysAllowed = false
        body.style.filter = 'blur(200px)'
        body.style.backdropFilter = 'blur(200px)'
        await new Promise(resolve => setTimeout(resolve, 500))
        
        data = []
        while(data.length != 10){
            placeResults()
        }
        
        body.style.backgroundImage = `url('bg-${bgNum}.jpg')`
        let bloclColors = ['linear-gradient(to right, black, #434343)', 'linear-gradient(to right, #0575e6, #021b79)']
        blocks().forEach(block => block.style.background = bloclColors[bgNum - 1])
        bgNum = bgNum == 4 ? 1 : bgNum + 1
        
        body.style.filter = 'blur(0px)'
        body.style.backdropFilter = 'blur(0px)'
        await new Promise(resolve => setTimeout(resolve, 500))
        
        triggerCountdown()
        bgMusic.play()
        keysAllowed = true
    }
})