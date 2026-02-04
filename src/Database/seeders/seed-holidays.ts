import { Prisma } from 'generated/prisma';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

/**
 * Seeds Bangladesh public holidays for 2024
 */
export const seedBangladeshHolidays = async (
  tx: Prisma.TransactionClient,
  businessId: number,
) => {
  console.log('   🎉 Creating Bangladesh holidays...');

  const holidays = await tx.holiday.createMany({
    data: [
      // National Holidays
      {
        name: 'International Mother Language Day',
        description:
          'Commemorates the Language Movement martyrs who sacrificed their lives for Bengali language recognition.',
        startDate: dayjs.utc('2024-02-21').toISOString(),
        endDate: dayjs.utc('2024-02-21').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'PUBLIC',
        businessId,
      },
      {
        name: 'Independence Day',
        description:
          'Celebrates the declaration of independence of Bangladesh from Pakistan in 1971.',
        startDate: dayjs.utc('2024-03-26').toISOString(),
        endDate: dayjs.utc('2024-03-26').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'PUBLIC',
        businessId,
      },
      {
        name: 'Bengali New Year (Pohela Boishakh)',
        description:
          'The first day of the Bengali calendar, celebrated with traditional festivities.',
        startDate: dayjs.utc('2024-04-14').toISOString(),
        endDate: dayjs.utc('2024-04-14').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'PUBLIC',
        businessId,
      },
      {
        name: 'May Day (Labour Day)',
        description:
          'International Workers Day, honoring the achievements of workers.',
        startDate: dayjs.utc('2024-05-01').toISOString(),
        endDate: dayjs.utc('2024-05-01').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'PUBLIC',
        businessId,
      },
      {
        name: 'National Mourning Day',
        description:
          'Commemorates the assassination of Sheikh Mujibur Rahman, the Father of the Nation.',
        startDate: dayjs.utc('2024-08-15').toISOString(),
        endDate: dayjs.utc('2024-08-15').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'PUBLIC',
        businessId,
      },
      {
        name: 'Victory Day',
        description:
          'Celebrates the victory of Bangladesh in the Liberation War of 1971.',
        startDate: dayjs.utc('2024-12-16').toISOString(),
        endDate: dayjs.utc('2024-12-16').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'PUBLIC',
        businessId,
      },

      // Religious Holidays (Islamic)
      {
        name: 'Eid-ul-Fitr',
        description:
          'Marks the end of Ramadan, the Islamic holy month of fasting.',
        startDate: dayjs.utc('2024-04-11').toISOString(),
        endDate: dayjs.utc('2024-04-13').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'RELIGIOUS',
        businessId,
      },
      {
        name: 'Eid-ul-Adha',
        description:
          "Festival of Sacrifice, commemorating Prophet Ibrahim's willingness to sacrifice his son.",
        startDate: dayjs.utc('2024-06-17').toISOString(),
        endDate: dayjs.utc('2024-06-19').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'RELIGIOUS',
        businessId,
      },
      {
        name: 'Shab-e-Qadr',
        description:
          'The Night of Power, the holiest night in the Islamic calendar.',
        startDate: dayjs.utc('2024-04-06').toISOString(),
        endDate: dayjs.utc('2024-04-06').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'RELIGIOUS',
        businessId,
      },
      {
        name: 'Ashura',
        description:
          'Day of mourning for the martyrdom of Imam Hussain in the Battle of Karbala.',
        startDate: dayjs.utc('2024-07-17').toISOString(),
        endDate: dayjs.utc('2024-07-17').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'RELIGIOUS',
        businessId,
      },
      {
        name: 'Eid-e-Milad-un-Nabi',
        description: 'Celebrates the birth of Prophet Muhammad (PBUH).',
        startDate: dayjs.utc('2024-09-16').toISOString(),
        endDate: dayjs.utc('2024-09-16').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'RELIGIOUS',
        businessId,
      },

      // Religious Holidays (Hindu)
      {
        name: 'Durga Puja',
        description:
          'Major Hindu festival celebrating the victory of Goddess Durga over evil.',
        startDate: dayjs.utc('2024-10-10').toISOString(),
        endDate: dayjs.utc('2024-10-12').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'RELIGIOUS',
        businessId,
      },

      // Religious Holidays (Buddhist)
      {
        name: 'Buddha Purnima',
        description:
          'Celebrates the birth, enlightenment, and death of Gautama Buddha.',
        startDate: dayjs.utc('2024-05-23').toISOString(),
        endDate: dayjs.utc('2024-05-23').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'RELIGIOUS',
        businessId,
      },

      // Religious Holidays (Christian)
      {
        name: 'Christmas Day',
        description: 'Celebrates the birth of Jesus Christ.',
        startDate: dayjs.utc('2024-12-25').toISOString(),
        endDate: dayjs.utc('2024-12-25').toISOString(),
        isRecurring: true,
        isPaid: true,
        holidayType: 'RELIGIOUS',
        businessId,
      },
    ],
  });

  console.log(`   ✅ Created ${holidays.count} Bangladesh holidays`);
  return holidays;
};
