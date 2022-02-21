import React from 'react'
import MemberSocial from './MemberSocial'

const singleMember = props => {
    return (
        <div className="single-memb">
            <img src={ require("../assets/images/team/" + props.id + ".jpg") } alt="" />
            <div className="memb-details">
                <h6>{ props.name }</h6>
                <span>{ props.speciality }</span>
                <MemberSocial socialLinks={ props.social } />
            </div>
        </div>
    )
}

export default singleMember