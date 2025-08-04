import React, { useEffect } from 'react'
import { useAppDispatch } from '../../../store/hooks'
import { useParams } from 'react-router-dom';
import { getChatHistory } from '../../../store/slices/classroomSlice';

const ChatHistory = () => {
const dispatch = useAppDispatch()
  const { id: classroomId, studentId } = useParams<{
    id: string;
    studentId: string;
  }>();

useEffect(() => {
    const payload = {
     studentId,
    classroomId,    
    }
  dispatch(getChatHistory(payload))
},[])
    
  return (
    <div>

    </div>
  )
}

export default ChatHistory