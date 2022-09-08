<h1>Alpha Tree filters</h1>

<ul>
   <li>If you write several filters separately, they will be combined by <tt>and</tt>.</li>
   <li>
      Filter which doesn't contains "@" symbol traits as string search. Exact match for tags and regex match for strings
      (smart-case)
   </li>
   <li>
      Query language powered by <a
         class="ui-link ui-link-accent"
         href="https://github.com/joewalnes/filtrex"
         target="_blank">Filtrex</a
      >. You can use all its power.
   </li>
   <li>
      To access the document's property, use @-notation. For example, <tt>@data.details.cr</tt> will transform into
      <tt>getProperty(document, "data.details.cr")</tt>.
   </li>
   <li>
      There are two special filters <tt>@onScene</tt> for actors which has tokens on the curren scene. And <tt>@fav</tt>
      for faved items (marked by <iconify-icon icon="fa-solid:star" /> when selected)
   </li>
</ul>

<h3>Examples</h3>
<ul>
   <li>
      <tt class="ui-badge">@data.details.cr >= 2</tt> shows dnd5e actors with Challange Rating >= 2
   </li>
   <li>
      <tt class="ui-badge">@data.rarity == "legendary"</tt> shows dnd5e items with Legendary rarity
   </li>
</ul>
