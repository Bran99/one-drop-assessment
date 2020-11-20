import './App.css'
import React, { Component } from 'react'

class Assessment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      products: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    this.fetchData()
    this.interval = setInterval(this.fetchData.bind(this), 60000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  fetchData() {
    fetch('https://onedrop.today/products.json')
      .then(res => res.json())
      .then(json => {
        // Exclude products where the first variant price is 0.00
        const products = json.products.filter(product => parseFloat(product.variants[0].price) > 0)

        // Custom sort method for descending prices
        // Based on the first variant's price
        products.sort((a, b) => parseFloat(b.variants[0].price) - parseFloat(a.variants[0].price))

        this.setState({
          isLoaded: true,
          products: products
        })
      })
  }

  render() {
    const { isLoaded, products } = this.state

    if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <div className="App">
          <h1>One Drop Assessment — Brandon Goodman</h1>
          <table className="items-table">
            <thead>
              <tr className="items-table__row">
                <th className="items-table__header">Product Title</th>
                <th className="items-table__header">Variant Price (descending)</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="items-table__row">
                  <td className="items-table__item">{product.title}</td>
                  <td className="items-table__item">{product.variants[0].price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
  }
}

export default Assessment
