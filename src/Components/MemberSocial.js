import React from 'react'

const memberSocial = props => {
    // console.log(props.socialLinks)

    const links = Object.keys(props.socialLinks).map( link => {
        // console.log( link )
        switch(link) {
            case 'facebook': 
                return <a href={props.socialLinks[link]} key={ link }><i className="ti-facebook"></i></a>
            case 'twitter': 
                return <a href={props.socialLinks[link]} key={ link }><i className="ti-twitter-alt"></i></a>
            case 'googlePlus': 
                return <a href={props.socialLinks[link]} key={ link }><i className="ti-google"></i></a>
            case 'instagram': 
                return <a href={props.socialLinks[link]} key={ link }><i className="ti-instagram"></i></a>
            default: 
                return null
        }
    } )

    return (
        <div className="memb-social">
            { links }
        </div>
    )
}

export default memberSocial