import React from 'react';
import PetListEntry from './PetList/PetListEntry.js';
import PropTypes from 'prop-types';

//a list of redirect links to petprofile /pet/:id
//url is an image of the pet
//link is the redirect to the pet's profile page
const PetList = ({petData}) => {
  {console.log("Hello is anybody there", petData)}
  return (
    <div>
      {petData.map(data => (
        <PetListEntry
          name={data.name}
          id={data.pet_}
          imgUrl={data.url}
        />
      ))}
    </div>
  );
}

PetList.propTypes = {
  petData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export default PetList;
