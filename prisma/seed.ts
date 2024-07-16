import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
// import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	const USER_ID = generateIdFromEntropySize(10);
	// const USER_PASSWORD = 'password';

	// const passwordHash = await hash(USER_PASSWORD, {
	// 	memoryCost: 19456,
	// 	timeCost: 2,
	// 	outputLen: 32,
	// 	parallelism: 1
	// });

	const passwordHash =
		'$argon2id$v=19$m=19456,t=2,p=1$TYZ1GG90B8wXXdUSoU1UFQ$DjqvTNIK7gNSD3o+IpPPHOPC6Sch2tOh16hFcqnM5uM'; // Have fun figuring out the password :)

	await prisma.user.create({
		data: {
			id: USER_ID,
			password_hash: passwordHash,
			username: 'posandu'
		}
	});

	/**
	 * Generate random categories
	 */
	const cats = ['Biology', 'Chemistry', 'Physics', 'Economics', 'Computer Science'];

	const CAT_IDs: string[] = [];

	const promises = cats.map(async (cat) => {
		const item = await prisma.category.create({
			data: {
				name: cat,
				user: { connect: { id: USER_ID } }
			}
		});

		CAT_IDs.push(item.id);
	});

	await Promise.all(promises);

	/**
	 * Generate notes
	 */
	for (let i = 0; i < 40; i++) {
		const note = await prisma.note.create({
			data: {
				title: faker.lorem.sentence(),
				content: faker.lorem.paragraphs(),
				category: { connect: { id: CAT_IDs[Math.floor(Math.random() * CAT_IDs.length)] } },
				user: { connect: { id: USER_ID } }
			}
		});

		console.log(`Created note with id: ${note.id}`);
	}

	/**
	 * The real one for testing: business studies
	 */
	const bsCat = await prisma.category.create({
		data: {
			name: 'Business Studies',
			user: { connect: { id: USER_ID } }
		}
	});

	// Credits to https://drtayeb.wordpress.com/wp-content/uploads/2011/12/business-studies-notes.pdf for the notes
	const bsNotes = [
		{
			title: 'The purpose of Business Activity',
			content: `A NEED is a good or service essential for living (food, water, shelter, education etc.). A WANT on the other hand is something we would like to have but is not essential for living (computer games, designer clothing, cars etc.). people’s wants are unlimited. The Economic Problem results from an unlimited amount of wants and a limited amount of resources to produce those goods and wants.

There are several things that cause the Economic Problem. These factors are known as Factors of Productions (resources of production) and a lack of them causes scarcity. These factors are as follows:

- **Land**: This term refers to all the natural resources provided by nature and includes fields, forests, oil, gas, coal, metals and other mineral resources.
- **Labour**: This is the efforts of the people required to produce the final product. Examples: the police, lawyers, doctors, teachers etc.
- **Capital**: This is the finance, machinery, and equipment required to produce the goods. The 'price' of acquiring capital is referred to as interest. Examples: computers, cranes, cement mixers, coffee makers, specialist machinery for factories etc.
- **Enterprise**: This is the skill and risk taking ability of the person who brings the other resources or factors of production together to produce the goods or provide a service. The return for enterprise is called profit. For example the owners of a business. These people are referred to as entrepreneurs.

As there are never enough of the above factors to produce all the needs and wants of people we continually face the economic problem of scarcity. When there is a lack of resources it is impossible to satisfy all our wants, therefore, we must decide which wants we wish to satisfy and which we intend to sacrifice. Those that we sacrifice automatically become known as the OPPORTUNITY COST. The OPPORTUNITY COST is the next best alternative to the good that we are buying.

Factors of Production are always in limited supply therefore it is important to use these resources in the most efficient way.

Over time production methods change. Machinery is now more widely used to produce goods than before, and large firms are more common than they used to be. These firms employ specialised workers for special tasks.
`
		},
		{
			title: 'Specialisation and Division',
			content: `The reason these large firms are so successful is because they employ the production
methods of SPECIALISATION and DIVISION. A firm using this method employs
a large labour workforce and then distributes the work equally amongst them. This
can lead to a rise in production levels. However, this method has advantages as well
as disadvantages.

**Advantages**
- Workers are trained in one task and specialise in it – this leads to increased efficiency and output.
- Less time is wasted moving from one workbench to another.

**Disadvantages**
- Workers may become bored doing one job – efficiency may fall.
- If one worker is absent and no one else can do his job then production may stop.
`
		},
		{
			title: 'Forms of business organisation',
			content: `There are five main types of business organisations in the private sector:
1. Sole Traders
2. Private Limited Companies
3. Public Limited Companies
4. Partnerships
5. Co-operative
`
		},
		{
			title: 'Sole Trader',
			content: `A sole trader is a very common form of business organisation. It is owned and operated by a single person. The sole proprietor can employ more people if he wants. One of the main reasons it is very common is because it requires very few legal formalities. Only the following regulations must be followed:

1. The name of the business is very important. In some countries it must be registered with the Registrar of Business Names. In the UK it is sufficient enough that all the business’s documents have the firm’s name on them. It is also required a notice with the name of the owner be placed at the main office.
2. The sole trader must register with and submit an annual record of accounts to the Tax Office.
3. In some industries it is necessary that the sole trader follow certain regulations like health and safety laws. The sole trader may also have to obtain a licence to operate a car or sell alcohol.

### Advantages of a Sole Trader:
1. Few legal formalities
2. Complete control
3. Freedom of how to manage business
4. Personal contact with customers
5. Profit motive provides incentive to work harder
6. Secrecy where concerned with business matters

### Disadvantages of a Sole Trader:
1. There is no one to discuss business matters with
2. The owner does not benefit from limited liability. The business is not a separate legal unit. The business’s accounts cannot be separated from the owner’s accounts. This means the owner is responsible for any of the debts the business may run into. If the owner can’t pay the money his creditors can force him or her to sell their personal property to pay their debts.
3. There is limited capital available to expand the business. The business’s financial sources are limited to the owner’s profits, savings and small bank loans. Banks usually hesitate to give large sums of money to such small firms.
4. Due to the size of the business the owner cannot afford to employ specialists to perform certain tasks, like managing the accounts of the business. As a result the owner may be forced to do certain things he is not skilled at.
5. The business is likely to stay small without any capital. It will not benefit from economies of scale. Due to the small size of the business it is very hard to find good recruits; no training or opportunities can be provided for their future careers.
6. After the death of the owner the business will cease to exist; since after the death of the owner there is no business continuity.
`
		},
		{
			title: 'Partnership',
			content: `A partnership is an association of between 2 or 20 people. The various partners will take a share of any of the profits, have a say in how the business is managed and contribute to the capital. A partnership can be formed quite quickly. For example, a sole trader could simply ask a friend to become his partner in a business. This is a verbal agreement. The sole trader would be advised to draw up a written agreement known as a Deed of Partnership or Partnership agreement. Without a Deed of Partnership, the owners may disagree with others about who contributed the most capital or who deserves the most amount of the profit. A written agreement settles all these matters.

A Limited Liability Partnership (LLP) could be formed after the year 2000 in the UK. However, shares in the business can’t be sold. The business is a separate legal unit and its accounts are separate from that of the owner. As a result, the business continues to function even if one of the owners dies, and the partners of a business have limited liability.
`
		}
	];

	bsNotes.forEach(async (note) => {
		const createdNote = await prisma.note.create({
			data: {
				title: note.title,
				content: note.content,
				category: { connect: { id: bsCat.id } },
				user: { connect: { id: USER_ID } }
			}
		});

		console.log(`Created note with id: ${createdNote.id}`);
	});

	console.log(`Seeding completed.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
	});
