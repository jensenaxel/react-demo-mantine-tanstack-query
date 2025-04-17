import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { ScrollArea, Title, Image, Card, Container, Box, Button, Group, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';

const HockeyTV: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const playerRef = useRef<HTMLMediaElement | null>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const formattedDate = useMemo(() => {
        return selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '2025-04-09';
    }, [selectedDate]);

    //const API_URL = `http://192.168.1.187:3000/api/nhlroutes/standings/${formattedDate}`;
    const API_URL = `https://hockeytv-api.onrender.com/api/nhlroutes/standings/${formattedDate}`;

    const { isLoading, error, data, refetch, isFetching } = useQuery({
        queryKey: ['nhl-data', formattedDate],
        queryFn: async () => {
            const res = await fetch(API_URL);
            const json = await res.json();

            const urls: string[] = [];
            json.games.forEach(({ tellmePreGameResultsMp3, standAloneVideoLink, tellmePostGameResultsMp3 }) => {
                if (tellmePreGameResultsMp3) urls.push(tellmePreGameResultsMp3);
                if (standAloneVideoLink) urls.push(standAloneVideoLink);
                if (tellmePostGameResultsMp3) urls.push(tellmePostGameResultsMp3);
            });

            return { urls, games: json.games };
        },
    });

    const currentUrl = data?.urls?.[currentIndex];

    const currentGame = useMemo(() => {
        return data?.games.find(
            (game) => game.tellmePreGameResultsMp3 === currentUrl || game.standAloneVideoLink === currentUrl || game.tellmePostGameResultsMp3 === currentUrl
        );
    }, [data?.games, currentUrl]);

    const awayTeamName = `${currentGame?.awayTeam?.placeName?.default} ${currentGame?.awayTeam?.commonName?.default}`;
    const homeTeamName = `${currentGame?.homeTeam?.placeName?.default} ${currentGame?.homeTeam?.commonName?.default}`;
    const easyName = `${awayTeamName} at ${homeTeamName} on ${dayjs(currentGame?.gameDate).format('MM-DD-YYYY')}`;

    const isAudio = currentUrl?.endsWith('.mp3');
    const isBrightcove = currentUrl?.includes('brightcove');
    const isVideo = currentUrl?.endsWith('.mp4') || isBrightcove;

    useEffect(() => {
        const player = playerRef.current;
        if (!player) return;

        const playOrPause = async () => {
            try {
                isPlaying ? await player.play() : player.pause();
            } catch {
                setIsPlaying(false);
            }
        };

        playOrPause();
    }, [isPlaying, currentIndex]);

    // ✅ Scroll selected card into view
    useEffect(() => {
        if (!data?.games || !currentUrl) return;

        const selectedGame = data.games.find((game) => game.tellmePreGameResultsMp3 === currentUrl || game.standAloneVideoLink === currentUrl);

        if (selectedGame && cardRefs.current[selectedGame.id]) {
            cardRefs.current[selectedGame.id]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [currentIndex, data?.games, currentUrl]);

    // ✅ Media Session API
    useEffect(() => {
        if ('mediaSession' in navigator && currentGame && currentUrl) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentGame.easyName,
                artist: 'HockeyTV',
                album: 'NHL Recaps',
                artwork: [
                    {
                        src: currentGame.homeTeam.logo,
                        sizes: '96x96',
                        type: 'image/png',
                    },
                ],
            });

            navigator.mediaSession.setActionHandler('nexttrack', handleNext);
            navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
        }
    }, [currentGame, currentUrl]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % data.urls.length);
        setIsPlaying(true);
    }, [data?.urls.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 < 0 ? data.urls.length - 1 : prev - 1));
        setIsPlaying(true);
    }, [data?.urls.length]);

    const togglePlay = () => setIsPlaying((prev) => !prev);

    if (isLoading) return <Text>Loading...</Text>;
    if (error instanceof Error) return <Text color='red'>Error: {error.message}</Text>;

    return (
        <section>
            <Header />
            <Container>
                <Title mb='md'>HockeyTV</Title>
                <DatePicker
                    label='Select a date to start watching from'
                    value={selectedDate}
                    onChange={setSelectedDate}
                    maxDate={new Date()}
                    minDate={dayjs().subtract(2, 'months').toDate()}
                    placeholder='Pick a date'
                    dropdownType='modal'
                    size='sm'
                    mb='md'
                />

                <Title order={3} mb='xs'>
                    {easyName ?? 'Unknown Game'}
                </Title>

                <Text size='sm' mb='sm'>
                    Games are listed in order they were played.
                </Text>

                <Group mb='md'>
                    <Button onClick={handlePrev}>Previous</Button>
                    {!isBrightcove && <Button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</Button>}
                    <Button onClick={handleNext}>Next</Button>
                </Group>

                <div>
                    {isAudio && (
                        <audio
                            key={currentUrl} // ✅ force remount when URL changes
                            ref={(el) => (playerRef.current = el)}
                            controls
                            autoPlay={isPlaying}
                            onEnded={handleNext}
                            style={{ width: '100%' }}
                        >
                            <source src={currentUrl} type='audio/mpeg' />
                        </audio>
                    )}

                    {isVideo && !isBrightcove && (
                        <video
                            key={currentUrl}
                            ref={(el) => (playerRef.current = el)}
                            controls
                            autoPlay={isPlaying}
                            onEnded={handleNext}
                            style={{ width: '100%' }}
                        >
                            <source src={currentUrl} type='video/mp4' />
                        </video>
                    )}

                    {isBrightcove && <iframe src={`${currentUrl}&autoplay=1`} width='100%' height='360' allow='autoplay; encrypted-media' allowFullScreen />}
                </div>

                <Box mt='xl' ml='xl' mr='xl'>
                    <ScrollArea
                        type='always'
                        style={{
                            overflowX: isMobile ? 'hidden' : 'auto',
                            overflowY: isMobile ? 'auto' : 'hidden',
                            maxHeight: isMobile ? 600 : undefined,
                        }}
                    >
                        <Group spacing='md' noWrap={!isMobile} direction={isMobile ? 'column' : 'row'} px='sm'>
                            {data?.games.map((game) => {
                                const awayTeamName = `${game?.awayTeam?.placeName?.default} ${game?.awayTeam?.commonName?.default}`;
                                const homeTeamName = `${game?.homeTeam?.placeName?.default} ${game?.homeTeam?.commonName?.default}`;
                                const easyName = `${awayTeamName} at ${homeTeamName}`;
                                const currentDate = `${dayjs(game?.gameDate).format('MM-DD-YYYY')}`;
                                const isCurrent =
                                    data.urls[currentIndex] === game.tellmePreGameResultsMp3 ||
                                    data.urls[currentIndex] === game.standAloneVideoLink ||
                                    data.urls[currentIndex] === game.tellmePostGameResultsMp3;

                                return (
                                    <Card
                                        key={game.id}
                                        ref={(el) => (cardRefs.current[game.id] = el)}
                                        shadow='sm'
                                        radius='md'
                                        padding='md'
                                        withBorder
                                        style={{
                                            minWidth: isMobile ? '100%' : '200px',
                                            border: isCurrent ? '2px solid #1c7ed6' : '1px solid #ccc',
                                            transition: 'border-color 0.2s ease',
                                        }}
                                    >
                                        <Group position='center' spacing='xs'>
                                            <Image src={game.awayTeam.logo} width={40} />
                                            <Text size='sm'>vs</Text>
                                            <Image src={game.homeTeam.logo} width={40} />
                                        </Group>

                                        <Text mt='sm' align='center' size='md' color='dimmed'>
                                            {easyName}
                                        </Text>
                                        <Text mt='sm' align='center' size='xl' color='dimmed'>
                                            {currentDate}
                                        </Text>

                                        <Button
                                            fullWidth
                                            mt='md'
                                            size='xs'
                                            onClick={() => {
                                                const newIndex = data.urls.findIndex(
                                                    (url) => url === game.tellmePreGameResultsMp3 || url === game.standAloneVideoLink
                                                );
                                                if (newIndex !== -1) {
                                                    setCurrentIndex(newIndex);
                                                    setIsPlaying(true);
                                                }
                                            }}
                                        >
                                            Play This Game
                                        </Button>
                                    </Card>
                                );
                            })}
                        </Group>
                    </ScrollArea>
                </Box>
            </Container>
        </section>
    );
};

export default HockeyTV;
