import React, { Component } from 'react'
import SingleMember from '../Components/SingleMember'

class Team extends Component {

    state = {
        members: [
            {
                id: 1,
                name: 'Joseph Austin',
                specialist: 'Thai Message',
                social: {
                    facebook: "https://facebook.com",
                    twitter: "https://twitter.com",
                    instagram: "https://instagram.com"
                }
            },
            {
                id: 2,
                name: 'David Hannan',
                specialist: 'Thai Message',
                social: {
                    facebook: "https://facebook.com",
                    twitter: "https://twitter.com",
                    instagram: "https://instagram.com",
                    googlePlus: "https://google.com"
                }
            },
            {
                id: 3,
                name: 'Cheryl Harris',
                specialist: 'Thai Message',
                social: {
                    facebook: "https://facebook.com",
                    twitter: "https://twitter.com",
                    instagram: "https://instagram.com",
                    googlePlus: "https://google.com"
                }
            }            
        ]
    }

    render() {


        const members = this.state.members.map( memb => {
            return (
                <div className="col-md-4" key={ memb.id }>
                    <SingleMember 
                        id={ memb.id }
                        name={ memb.name }
                        speciality={ memb.specialist }
                        social={ memb.social }
                    />
                </div>
                
            )
        })

        return (
            // Team section start
            <section className="team">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-10 m-auto">
                            <div className="sec-heading">
                                <h3 className="sec-title">Experienced Team</h3>
                                <p>To doesn't his appear replenish together called he of mad place won't wherein blessed second every wherein were meat kind wherein and martcin</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        { members }
                    </div>
                </div>
            </section>
            // Team section end
        )
    }
    
}

export default Team