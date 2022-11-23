const matterList = []
Fetch.then(fetchData => {
    let labels = fetchData.labels
    let data = fetchData.data
    let aktiva = data.getActive()
    if (!localStorage.getItem("favorites")) {
        localStorage.setItem("favorites", JSON.stringify([]))
    }
    for (let m of aktiva) {
        let container = document.getElementById("latest-matters")
        let matter = new Matter(container, m)
        matterList.push(matter)
        console.log(m)
    }


})


class Matter {
    constructor(parent, data) {
        this.id = data.MatterId.toString()
        this.head = data.Rubrik
        this.text = data.Sammanfattning
        this.votes = Number(data["Röster"])
        this.category = data["Gäller"]
        this.img = this.category.split(/[ \/]/)[0].replace(/[^A-ö]/g, "").toLowerCase() + Math.round(Math.random() + 1).toString()
        console.log(this.img)
        this.parent = parent
        this.container
        this.setHtml()
        this.init()
    }
    get infoStyle() {
        this.votes < 20
        let x = this.votes > 180 ? "top:0; color:black;" : this.votes < 20 ? "bottom:10%; color:black;" : "bottom:" + Math.max(0, ((this.votes / 200) * 100) + 10) + "%; color:white"
        console.log(x)
        return x
    }
    get template() {
        return `<div class="matter-img">
    <img src="/img/${this.img}.jpg" alt="" />
</div>

<div class="matter-info">
    <h2 class="matter-head">${this.head}</h2>
    <p class="matter-text">${this.text}</p>
    <div class="btn-container">
        <a href="https://eforslag.goteborg.se/ViewFeedBasic.aspx?FeedId=1&ItemId=${this.id}&sharing=vfb" target="_blank"><div class="matter-btn">Läs mer & Rösta</div></a>
        <div data-mId="${this.id}" class="fav-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path transform="scale(0.95) translate(0.5,0.5)" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg>
            </div>
    </div>
</div>`
    }


    setHtml() {
        this.container = document.createElement("div")
        this.container.classList.add("matter-wrapper")
        this.container.setAttribute("id", this.id)
        this.container.innerHTML = this.template
        this.parent.appendChild(this.container)

    }

    init() {
        if (!localStorage.getItem("favorites")) {
            localStorage.setItem("favorites", JSON.stringify([]))
        }
        let fav = this.container.querySelector(".fav-btn")
        fav.addEventListener("click", (event) => {
            let list = JSON.parse(localStorage.getItem("favorites"))
            let btn = event.currentTarget
            console.log(event.currentTarget)
            if (btn.classList.contains("selected")) {
                btn.classList.remove("selected")
                list.splice(list.indexOf(this.id), 1)
            } else {
                btn.classList.add("selected")
                list.push(this.id)
            }
            localStorage.setItem("favorites", JSON.stringify(list))
            console.log(localStorage.getItem("favorites"))
        })
    }
    update() {
        let list = localStorage.getItem("favorites")

    }
}
