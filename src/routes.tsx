import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Count from './pages/Count';
import Tanstack from './pages/Tanstack';
import NotFound from './pages/NotFound';
import Questions from './pages/Questions';
import QuestionsEdit from './pages/QuestionsEdit';

export default (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/count' element={<Count />} />
        <Route path='/tanstack' element={<Tanstack />} />
        <Route path='/questions' element={<Questions />} />
        <Route path='/questions/:id' element={<QuestionsEdit />} />
        <Route path='*' element={<NotFound />} />
    </Routes>
);
