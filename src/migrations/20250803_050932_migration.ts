import {
  MigrateDownArgs,
  MigrateUpArgs,
} from '@payloadcms/db-mongodb'

export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  // Array of tenants to create
  const tenantsToCreate = [
    {
      name: "Admin's Store",
      slug: "admin-store",
      stripeAccountId: "acct_admin123",
      stripeDetailsSubmitted: true,
    },
    {
      name: "John's Store",
      slug: "john-store",
      stripeAccountId: "acct_john123",
      stripeDetailsSubmitted: true,
    },
    {
      name: "Marc's Store",
      slug: "marc-store",
      stripeAccountId: "acct_marc123",
      stripeDetailsSubmitted: true,
    }
  ];

  // Create tenants first
  const createdTenants = [];
  for (const tenantData of tenantsToCreate) {
    const existingTenant = await payload.find({
      collection: 'tenants',
      where: {
        slug: { equals: tenantData.slug },
      },
    })

    if (existingTenant.docs.length === 0) {
      const tenant = await payload.create({
        collection: 'tenants',
        data: tenantData,
      })
      
      createdTenants.push(tenant);
      console.log(`Tenant ${tenantData.name} created successfully`)
    } else {
      createdTenants.push(existingTenant.docs[0]);
      console.log(`Tenant ${tenantData.name} already exists`)
    }
  }

  // Create categories
  const categoriesToCreate = [
    {
      name: "Red Wine",
      slug: "red-wine",
      color: "#8B0000", // Dark red
    },
    {
      name: "White Wine",
      slug: "white-wine",
      color: "#F5F5DC", // Beige
    },
    {
      name: "Fortified Wine",
      slug: "fortified-wine",
      color: "#8B4513", // Brown
    },
    {
      name: "Rosé Wine",
      slug: "rose-wine",
      color: "#FFB6C1", // Light pink
    }
  ];

  // Create categories and store their IDs
  const categoryMap = {};
  for (const categoryData of categoriesToCreate) {
    const existingCategory = await payload.find({
      collection: 'categories',
      where: {
        slug: { equals: categoryData.slug },
      },
    })

    if (existingCategory.docs.length === 0) {
      const category = await payload.create({
        collection: 'categories',
        data: categoryData,
      })
      
      categoryMap[categoryData.slug] = category.id;
      console.log(`Category ${categoryData.name} created successfully`)
    } else {
      categoryMap[categoryData.slug] = existingCategory.docs[0].id;
      console.log(`Category ${categoryData.name} already exists`)
    }
  }

  // Create tags
  const tagsToCreate = [
    {
      name: "Premium",
      slug: "premium",
    },
    {
      name: "Organic",
      slug: "organic",
    },
    {
      name: "Vintage",
      slug: "vintage",
    },
    {
      name: "Sparkling",
      slug: "sparkling",
    },
    {
      name: "Sweet",
      slug: "sweet",
    },
    {
      name: "Dry",
      slug: "dry",
    }
  ];

  // Create tags and store their IDs
  const tagMap = {};
  for (const tagData of tagsToCreate) {
    const existingTag = await payload.find({
      collection: 'tags',
      where: {
        name: { equals: tagData.name },
      },
    })

    if (existingTag.docs.length === 0) {
      const tag = await payload.create({
        collection: 'tags',
        data: tagData,
      })
      
      tagMap[tagData.slug] = tag.id;
      console.log(`Tag ${tagData.name} created successfully`)
    } else {
      tagMap[tagData.slug] = existingTag.docs[0].id;
      console.log(`Tag ${tagData.name} already exists`)
    }
  }

  // Array of users to create with tenant relationships
  const usersToCreate = [
    {
      email: 'admin@admin.com',
      username: 'admin',
      password: 'demo',
      roles: ['super-admin'],
      tenants: [{ tenant: createdTenants[0].id }], // Admin's store
    },
    {
      email: 'john@john.com',
      username: 'john',
      password: 'demo',
      roles: ['user'],
      tenants: [{ tenant: createdTenants[1].id }], // John's store
    },
    {
      email: 'marc@marc.com',
      username: 'marc',
      password: 'demo',
      roles: ['user'],
      tenants: [{ tenant: createdTenants[2].id }], // Marc's store
    }
  ];

  // Create each user if they don't already exist
  for (const userData of usersToCreate) {
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: { equals: userData.email },
      },
    })

    if (existingUser.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: userData,
      })
      
      console.log(`User ${userData.username} created successfully`)
    } else {
      // Update existing user with tenant relationship if needed
      await payload.update({
        collection: 'users',
        id: existingUser.docs[0].id,
        data: {
          tenants: userData.tenants,
        },
      })
      console.log(`User ${userData.username} already exists, updated with tenant relationship`)
    }
  }

  // Create products for John's store
  const johnStoreProducts = [
    {
      name: "Premium Red Wine",
      description: "A rich, full-bodied red wine with notes of blackberry and oak",
      price: 29.99,
      currency: "USD",
      tax: "20%",
      refundPolicy: "14-day",
      category: categoryMap["red-wine"], // Link to Red Wine category
      tenant: createdTenants[1].id, // John's store tenant ID
      tags: [tagMap["premium"]] // Single tag per product
    },
    {
      name: "Sparkling White Wine",
      description: "Crisp and refreshing sparkling wine with citrus undertones",
      price: 24.99,
      currency: "USD",
      tax: "20%",
      refundPolicy: "14-day",
      category: categoryMap["white-wine"], // Link to White Wine category
      tenant: createdTenants[1].id, // John's store tenant ID
      tags: [tagMap["sparkling"]] // Single tag per product
    }
  ];

  // Create products for Marc's store
  const marcStoreProducts = [
    {
      name: "Vintage Port",
      description: "Aged port wine with rich flavors of dried fruits and chocolate",
      price: 45.99,
      currency: "USD",
      tax: "20%",
      refundPolicy: "30-day",
      category: categoryMap["fortified-wine"], // Link to Fortified Wine category
      tenant: createdTenants[2].id, // Marc's store tenant ID
      tags: [tagMap["vintage"]] // Single tag per product
    },
    {
      name: "Rosé Wine",
      description: "Light and fruity rosé with hints of strawberry and melon",
      price: 19.99,
      currency: "USD",
      tax: "20%",
      refundPolicy: "30-day",
      category: categoryMap["rose-wine"], // Link to Rosé Wine category
      tenant: createdTenants[2].id, // Marc's store tenant ID
      tags: [tagMap["organic"]] // Single tag per product
    }
  ];

  // Create products for John's store
  for (const productData of johnStoreProducts) {
    const existingProduct = await payload.find({
      collection: 'products',
      where: {
        and: [
          { name: { equals: productData.name } },
          { tenant: { equals: productData.tenant } }
        ]
      },
    })

    if (existingProduct.docs.length === 0) {
      await payload.create({
        collection: 'products',
        data: productData,
      })
      
      console.log(`Product ${productData.name} created for John's store`)
    } else {
      // Update existing product with tags
      await payload.update({
        collection: 'products',
        id: existingProduct.docs[0].id,
        data: {
          tags: productData.tags
        },
      })
      console.log(`Product ${productData.name} already exists for John's store, updated with tags`)
    }
  }

  // Create products for Marc's store
  for (const productData of marcStoreProducts) {
    const existingProduct = await payload.find({
      collection: 'products',
      where: {
        and: [
          { name: { equals: productData.name } },
          { tenant: { equals: productData.tenant } }
        ]
      },
    })

    if (existingProduct.docs.length === 0) {
      await payload.create({
        collection: 'products',
        data: productData,
      })
      
      console.log(`Product ${productData.name} created for Marc's store`)
    } else {
      // Update existing product with tags
      await payload.update({
        collection: 'products',
        id: existingProduct.docs[0].id,
        data: {
          tags: productData.tags
        },
      })
      console.log(`Product ${productData.name} already exists for Marc's store, updated with tags`)
    }
  }
}

export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Array of emails to remove
  const emailsToRemove = [
    'admin@admin.com',
    'john@john.com',
    'marc@marc.com'
  ];

  // Array of tenant slugs to remove
  const tenantSlugsToRemove = [
    'admin-store',
    'john-store',
    'marc-store'
  ];

  // Product names to remove
  const productNamesToRemove = [
    "Premium Red Wine",
    "Sparkling White Wine",
    "Vintage Port",
    "Rosé Wine"
  ];

  // Category slugs to remove
  const categorySlugsToRemove = [
    "red-wine",
    "white-wine",
    "fortified-wine",
    "rose-wine"
  ];

  // Tag names to remove
  const tagNamesToRemove = [
    "Premium",
    "Organic",
    "Vintage",
    "Sparkling",
    "Sweet",
    "Dry"
  ];

  // Remove products first
  for (const productName of productNamesToRemove) {
    try {
      const products = await payload.find({
        collection: 'products',
        where: {
          name: { equals: productName },
        },
      })
      
      for (const product of products.docs) {
        await payload.delete({
          collection: 'products',
          id: product.id,
        })
        console.log(`Product ${productName} removed successfully`)
      }
    } catch (error) {
      console.error(`Error removing product ${productName}:`, error)
    }
  }

  // Remove each user
  for (const email of emailsToRemove) {
    try {
      const user = await payload.find({
        collection: 'users',
        where: {
          email: { equals: email },
        },
      })
      
      if (user.docs.length > 0) {
        await payload.delete({
          collection: 'users',
          id: user.docs[0].id,
        })
        console.log(`User with email ${email} removed successfully`)
      }
    } catch (error) {
      console.error(`Error removing user with email ${email}:`, error)
    }
  }

  // Remove each tenant
  for (const slug of tenantSlugsToRemove) {
    try {
      const tenant = await payload.find({
        collection: 'tenants',
        where: {
          slug: { equals: slug },
        },
      })
      
      if (tenant.docs.length > 0) {
        await payload.delete({
          collection: 'tenants',
          id: tenant.docs[0].id,
        })
        console.log(`Tenant with slug ${slug} removed successfully`)
      }
    } catch (error) {
      console.error(`Error removing tenant with slug ${slug}:`, error)
    }
  }

  // Remove each category
  for (const slug of categorySlugsToRemove) {
    try {
      const category = await payload.find({
        collection: 'categories',
        where: {
          slug: { equals: slug },
        },
      })
      
      if (category.docs.length > 0) {
        await payload.delete({
          collection: 'categories',
          id: category.docs[0].id,
        })
        console.log(`Category with slug ${slug} removed successfully`)
      }
    } catch (error) {
      console.error(`Error removing category with slug ${slug}:`, error)
    }
  }

  // Remove each tag
  for (const name of tagNamesToRemove) {
    try {
      const tag = await payload.find({
        collection: 'tags',
        where: {
          name: { equals: name },
        },
      })
      
      if (tag.docs.length > 0) {
        await payload.delete({
          collection: 'tags',
          id: tag.docs[0].id,
        })
        console.log(`Tag with name ${name} removed successfully`)
      }
    } catch (error) {
      console.error(`Error removing tag with name ${name}:`, error)
    }
  }
}
