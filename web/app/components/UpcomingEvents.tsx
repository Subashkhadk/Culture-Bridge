'use client';

import { motion } from 'framer-motion';

export default function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: 'Language Exchange: Spanish/English',
      description: 'Join a guided conversation group to practice your skills and meet new friends.',
      time: 'Oct 24, 15:00 GMT',
      type: 'calendar_today',
      attendees: 12,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgZeAKpMqB0phFk0NktXg1R6JAL7jHY79UJbuP9c7RXtGuQe1OdedRR11TQ_X_1EQIPZCfR-OwQXdYBEfki679-tegxZ3o3ituaQoeZbKGh0fMb0JrcBvL47JkJAx1tdPK7oBnyPdUNKKZfv-H_I2ZnSKvxOqgttmi4my8nsB7ffBPlbHyqU73TgluVPmLthjERPGplKTqSZT564pMK2bqxa4OOE0s59zRG3ndXz0U8So1ZWZfZJfZXxI0YHDkKFXBRFVee7RCqJo',
    },
    {
      id: 2,
      title: 'Cooking Masterclass: Dim Sum',
      description: 'Step-by-step workshop on traditional dumpling folding techniques from Hong Kong.',
      time: 'LIVE NOW',
      type: 'videocam',
      attendees: 428,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA05XAH7bd7j_zmxYYDSoWy5HhBt_7KZtlV6KlUsd7XXyPmVDHhoqwTOzw_KH-4Tkbphh0s3Y00lwrExai8KgajiFWCn0PWucbNwjAfVJETkZ1gzQM1FJNn24WKKoRkGDds-0Lk2tlB_sX69JX5nBEdvDPlJWx3W-9r0FkI0iItRIZ4ON4UAAsFQvgrxBWdzA-pKL3R9s6WtyDuVqeJDA7j2iq_im2UsDiLJwzJhTH-P8cgIKhoWbnb3tUkklttA2gLgFS6A1lL0qk',
      live: true,
    },
    {
      id: 3,
      title: 'Oral Histories: The Griot Tradition',
      description: 'An evening of storytelling and music exploring the hereditary poets of West Africa.',
      time: 'Nov 02, 10:00 GMT',
      type: 'history_edu',
      attendees: 2400,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTjNA4bXH4fv71SpsMgO1U6hlRnYr109qmGItYDxCTJFEC7lyKseBb8iZLME7q7OLpXkCjO2A3RklvDsyuMJHFDDOHDtWXXlFOZHiIaMfiO80ZcdN7V-fTUKmFiYyvV98lUrSbA96RVpu62vbiJBOeib05Y-3Vq4muvCu2zzAzEdth8BWSPEBGO_ULlstE31EYcrbtPUwGKChNT6QlqIQKRRZaZDVDj5-36nD6LxcPBZGfVHuE05rq6CMX8-9fCDfJv4nZBLvd9Og',
    },
  ];

  return (
    <section className="py-2xl bg-surface-container-low">
      <div className="container max-w-[1280px] mx-auto px-gutter">
        <div className="mb-xl text-center max-w-2xl mx-auto space-y-sm">
          <h2 className="text-headline-lg font-headline-lg">Upcoming Global Events</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Live cultural exchanges and virtual gatherings you can join today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className="glass-card rounded-2xl p-md flex flex-col hover:shadow-lg transition-shadow group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-40 rounded-xl overflow-hidden mb-md">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={event.image}
                  alt={event.title}
                />
              </div>
              <div className="flex items-center gap-sm mb-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">{event.type}</span>
                <span className={`text-label-sm font-label-sm text-primary uppercase tracking-wider ${event.live ? 'animate-pulse' : ''}`}>
                  {event.time}
                </span>
              </div>
              <h4 className="text-headline-md text-[20px] font-bold mb-sm text-on-surface">{event.title}</h4>
              <p className="text-label-md font-label-md text-on-surface-variant mb-xl">{event.description}</p>
              <div className="mt-auto pt-md border-t border-outline-variant flex justify-between items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-dim"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-dim"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-dim"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-[10px] text-white flex items-center justify-center font-bold">
                    +{event.attendees}
                  </div>
                </div>
                {event.live ? (
                  <span className="bg-error/10 text-error px-md py-xs rounded-full text-[10px] font-bold flex items-center gap-xs animate-pulse">
                    <span className="w-1.5 h-1.5 bg-error rounded-full"></span>
                    {event.attendees} Watching
                  </span>
                ) : (
                  <button className="text-primary font-bold text-label-md hover:translate-x-1 transition-transform">
                    {event.attendees > 100 ? 'Save Spot' : 'Register'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
