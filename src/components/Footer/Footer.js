import React from 'react';
import './Footer.css';

import {BsGithub} from 'react-icons/bs';
import {AiOutlineMail} from 'react-icons/ai';
import {CiMail} from 'react-icons/ci';
import {MdOutlinePersonalVideo} from 'react-icons/md';

const Footer = () => {
    return (
        <div className='footer'>
            <div class="row">
                Copyright © 2023 || Designed by Nivas Bodapati
            </div>
            <div className='icons'>
                <a href="https://github.com/Nivi327" target='_balnk'><BsGithub className='icon'/></a>
                <a href="mailto:nivasbodapati2002@gmail.com"><AiOutlineMail className='icon'/></a>
                <a href='https://nivas-portfolio.vercel.app/'><MdOutlinePersonalVideo className='icon'/></a>
            </div>
        </div>
    )
}

export default Footer