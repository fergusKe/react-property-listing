import React from 'react';
import jump from 'jump.js';
import Card from './Card';
import Header from './Header';
import GoogleMap from './GoogleMap';
import data from './data/Data';
import { easeInOutCubic } from './utils/Easing'

class App extends React.Component {
  constructor(props){
		super(props);
		
		this.state = {
			properties: data.properties,
			activeProperty: data.properties[10],
			filterIsVisible: false,
			filterBedrooms: 'any',
			filterProperties: [],
			isFiltering: false,
		}
	}

	handleFilterChange = (e) => {
		const target = e.target;
		const { value, name } = target;

		this.setState({
			[name]: value
		}, function() {
			this.filterProperties();
		})
	}

	filterProperties = () => {
		const { properties, filterBedrooms } = this.state;
    const isFiltering = filterBedrooms !== 'any';

		const getFilteredProperties = (properties) => {
			const filteredProperties = [];

			properties.map(property => {
				const { bedrooms } = property;
				const match = bedrooms === parseInt(filterBedrooms) || filterBedrooms === 'any';

				// if the match is true push this property to filteredProperties
				match && filteredProperties.push(property);
			})

			return filteredProperties;
		}

		this.setState({
			filteredProperties: getFilteredProperties(properties),
			isFiltering
		})

	}

	toggleFilter = (e) => {
		e.preventDefault();
		this.setState({
			filterIsVisible: !this.state.filterIsVisible
		})
	}
	
	setActiveProperty = (property, scroll) => {
		const { index } = property;

		this.setState({
			activeProperty: property
		})

		if (scroll) {
			// scroll to the right property
			const target = `#card-${index}`;
			jump(target, {
				duration:800,
				easing: easeInOutCubic
			})
		}
	}

  render(){
		const { properties, activeProperty, filterIsVisible } = this.state;

    return (
      <div>
        {/* listings - Start */}
        <div className="listings">

          <Header
						filterIsVisible={filterIsVisible}
						toggleFilter={this.toggleFilter}
						handleFilterChange={this.handleFilterChange}	
					/>

          <div className="cards container">
            <div className="cards-list row ">
              
							{
								properties.map(property => {
									return <Card
										key={property._id}
										property={property}
										activeProperty={activeProperty}
										setActiveProperty={this.setActiveProperty}
									/>
								})
							}

            </div>
          </div>
        </div>
        {/* listings - End */}

				<GoogleMap
					properties={properties}
					activeProperty={activeProperty}
					setActiveProperty={this.setActiveProperty}
				/>

      </div>
    )
  }
}

export default App;