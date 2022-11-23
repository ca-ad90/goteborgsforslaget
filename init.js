
//      ------------------------------------------------------------------------
//
//      Den härfilen Skall ligga i <head></head> tagen
//      kopiera in raden:
//      <script src="/init.js"></script>
//
//
//      All javasctipt kod måste börja med koden nedan så kopiera in detta ( allt från /* till */):
//


/*
Fetch.then(data=>{

        //     READ ME
        //
        // data.data = ALLA förslag, gamla nya avslutade med mera.
        // data.categories = en Array med Alla unika "gäller-värden" så typ kategorier
        // data.office = Vilket kontor/nämnd som tar emot ärredet
        //-------------------------------------------
        // FILTRERA DATAN
        //
        //  data.getActive(<Filter-Object>,<Filter-Object>,....) =  Returnerar alla förslag som går att rösta på om inga paramerar anges.
        //                                                          går att filtrera, och returnerar då alla aktiva som passar filtret (se <Filter-Object> nedan)
        //  data.getCategories(<category>,<category>,....) = Returnerar alla förslag där popertyn "Gäller", stämmer överrens med någon av de angivna parametrarna
        //
        //  <category> = En textsträng, med önskad kategori
        //  data.getOffice(<office>,<office>,....) = samma som getCategories men för ansvarigt kontor
        //
        //  data.filterData(<Filter-Object>,<Filter-Object>,....)
        //
        //
        //
        //  Filter-Object: {<property>:<value>}
        //  value = <String>    kan innehålla <, >, <=, >=, !=, om man vill ha alla som är större
        //
        //                            eller mintre än ett värde, gäller även för datum
        //                            För att ha flera filter för samma property avgränsa med ";"
        //  inom varje "Filter-Object" kommer det att tolkas som "OCH", men mellan respektive "Filter-Object" tolkas det "ELLER"
        //
        //
        //
        //
        //  -EXEMPEL:
        //
        //
        //  Alla förslag med fler än 5 röster:
        //
        //  data.filterData(
        //        {
        //          röster:">5"
        //      }
        //  )
        //
        //    Alla förslag med fler än 5 röster OCH som gäller "Trafik och kommunikationer":
        //
        //  data.filterData(
        //      {
        //          röster:">5",
        //          gäller:"Trafik och kommunikationer"
        //      }
        //  )
        //
        //
        //
        //  Alla förslag med fler än 5 röster OCH som gäller "Trafik och kommunikationer":
        //  data.filterData(
        //      {
        //          röster:">5"
        //      },
        //      {
        //          gäller:"Trafik och kommunikationer"
        //      }
        //    )
        //

        //  Alla Arrayer som ni får ut med dessa metoder går att använda på samma sätt:
        //  let active = data.getActive()
        //  active = active.filterData({CreatedAt:">2022-09-01"})  variabeln active består nu av alla aktiva förslag som skapades senare än 2022-09-01



// Skriv All er kod här!!!





})

*/

const Fetch = new Promise(res => {
    Object.defineProperty(String.prototype, "cap", {
        get() {
            return this.substring(0, 1).toUpperCase() + this.substring(1)
        },
        configurable: true

    })
    fetch("data.json").then(res => {
        return res.json()
    }).then(data => {
        console.log(data.Matter)
        data = setProps(data.Matter)


        let category = []
        let office = []
        let resultat = []
        let status = []
        data.forEach(e => {
            if (category.indexOf(e.Gäller) == -1) {
                category.push(e.Gäller)
            }
            if (office.indexOf(e["Lämnas_till"]) == -1) {
                office.push(e["Lämnas_till"])
            }
            if (resultat.indexOf(e.Resultat) == -1) {
                resultat.push(e.Resultat)
            }
            if (status.indexOf(e.Status) == -1) {
                status.push(e.Status)
            }
        })
        res({ data: data, labels: { category: category, office: office, resultat: resultat, status: status } })

    })
    Object.defineProperty(String.prototype, "cap", {
        get() {
            return this.substring(0, 1).toUpperCase() + this.substring(1)
        },
        configurable: true

    })
    function setProps(data) {
        Object.defineProperties(data, {
            filterData: {
                value: function (filter) {
                    return filterData(this, filter)
                },
                configurable: true
            },
            getActive: {
                value: function (filter) {

                    let date = new Date(new Date().setDate(new Date().getDate() - 90))
                    let active = filterData(this, { Slutdatum: `>${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` })
                    return filterData(active, filter)
                },
                configurable: true
            },
            getCategory: {
                value: function (...categories) {
                    let obj = categories.map(e => {
                        return { Gäller: e }
                    })
                    return filterData(this, ...obj)
                },
                configurable: true
            },
            getOffice: {
                value: function (...offices) {
                    let obj = offices.map(e => {
                        return { lämnas_till: e }
                    })
                    return filterData(this, ...obj)

                },
                configurable: true
            }
        })
        return data
    }

    function filterData(data, ...filters) {
        if (filters.length < 1 || filters[0] == undefined || (filters.length == 1 && Object.keys(filters[0]).length == 0)) {
            return setProps(data)
        }
        let outData = []
        filters.forEach(filter => {
            let currentData = JSON.parse(JSON.stringify(data))
            for (let query in filter) {
                let q = {}
                q[query] = filter[query]
                currentData = filterQ(currentData, q)
            }
            outData = [].concat.apply([], [outData, currentData])
        })
        outData = setProps(outData)
        return outData

    }

    function filterQ(data, query) {
        data = JSON.parse(JSON.stringify(data))
        let q = Object.entries(query)[0]
        let qArr
        if (typeof q[1] == "object") {
            qArr = q[1].map(e => {
                return e.split(";").map(e => e.toString())
            }).flat()
        } else {
            qArr = q[1].split(";")
        }
        let prop = Object.keys(data[0])[Object.keys(data[0]).findIndex(e => e.toLowerCase() == q[0].toLowerCase())]
        let fData = data
        for (let qVal of qArr) {

            fData = fData.filter(dat => {
                let qDat = qVal
                let dVal = dat[prop]
                let retVal
                if (qDat.indexOf("search:") != -1) {
                    let str = qDat.replace("search:", "").trim()
                    retVal = dVal.indexOf(str) != -1
                } else {
                    if (qDat.split("").some(e => e == ">" || e == "<" || e == "=")) {
                        let test = qDat.replace(/[^<>!=]/g, "")

                        if (prop == "CreatedAt" ||
                            prop == "Slutdatum") {
                            qDat = qDat.replace(/[^\d-,]/g, "")
                            dVal = new Date(dVal).getTime()
                            qDat = new Date(qDat).getTime()
                        } else {
                            qDat = qDat.replace(/[^\d-,]/g, "")
                        }

                        let a, b
                        switch (test) {
                            case ">":
                                a = Number(dVal)
                                b = Number(qDat)

                                retVal = a > b
                                break;
                            case "<":
                                a = Number(dVal)
                                b = Number(qDat)

                                retVal = a < b
                                break;
                            case "<=":
                                a = Number(dVal)
                                b = Number(qDat)

                                retVal = a <= b
                                break;
                            case ">=":
                                a = Number(dVal)
                                b = Number(qDat)

                                retVal = a >= b
                                break;
                            case "!=":
                                retVal = dVal != qDat
                                break;
                        }

                    } else {
                        qDat = typeof dat[prop] == "number" ? Number(qDat) : qDat
                        if (typeof dat[prop] == "string") {
                            retVal = dat[prop].toLowerCase() == qDat.toLowerCase()
                        } else {
                            retVal = dat[prop] === qDat
                        }

                    }
                }

                let out = retVal
                return out
            })
        }
        return fData
    }
})
