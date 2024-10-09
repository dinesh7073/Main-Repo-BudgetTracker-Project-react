import { Result, Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {

    const navigate = useNavigate();
    return (
        <div>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" className='pe-4 ps-4' onClick={() => navigate('/Dashboard')}>Back Home</Button>}
            />
        </div>
    )
}

export default ErrorPage