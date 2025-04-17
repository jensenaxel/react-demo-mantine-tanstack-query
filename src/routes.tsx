import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Count from './pages/Count';
import Tanstack from './pages/Tanstack';
import Climbers from './pages/Climbers';
import Players from './pages/Players';
import HockeyTV from './pages/HockeyTV';
import NotFound from './pages/NotFound';
import TableDemo from './pages/TableDemo';
import Questions from './pages/Questions';
import QuestionsEdit from './pages/QuestionsEdit';

export default (
    <Routes>
        <Route path='/' element={<HockeyTV />} />
        <Route path='/climbers' element={<Climbers />} />
        <Route path='/hockeytv' element={<HockeyTV />} />
        <Route path='/players' element={<Players />} />
        <Route path='/count' element={<Count />} />
        <Route path='/tanstack' element={<Tanstack />} />
        <Route path='/table-demo' element={<TableDemo />} />
        <Route path='/home' element={<Home />} />
        <Route path='/questions' element={<Questions />} />
        <Route path='/questions/:id' element={<QuestionsEdit />} />
        <Route path='*' element={<NotFound />} />
    </Routes>
);
